const express = require('express');
const router = express.Router();
const Shelter = require('../models/Shelter');
const User = require('../models/User');
const { auth, checkRole } = require('../middleware/auth');
const { upload, uploadToCloudinary } = require('../middleware/upload');
const fs = require('fs');

// @route   GET /api/shelters
// @desc    Get all shelters with optional filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      search, 
      verified = 'true',
      city, 
      state,
      page = 1, 
      limit = 10 
    } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (verified !== 'all') {
      filter.isVerified = verified === 'true';
    }
    
    if (city) filter['address.city'] = { $regex: city, $options: 'i' };
    if (state) filter['address.state'] = { $regex: state, $options: 'i' };
    
    // Search by name or description
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query with pagination
    const shelters = await Shelter.find(filter)
      .sort({ averageRating: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'name email');
    
    // Get total count for pagination
    const total = await Shelter.countDocuments(filter);
    
    res.json({
      shelters,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get shelters error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/shelters/:id
// @desc    Get shelter by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const shelter = await Shelter.findById(req.params.id)
      .populate('user', 'name email')
      .populate('pets');
    
    if (!shelter) {
      return res.status(404).json({ message: 'Shelter not found' });
    }
    
    res.json(shelter);
  } catch (error) {
    console.error('Get shelter error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/shelters
// @desc    Create a new shelter
// @access  Private (User with role 'shelter')
router.post('/', auth, checkRole(['shelter']), upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'images', maxCount: 5 },
  { name: 'verificationDocuments', maxCount: 3 }
]), async (req, res) => {
  try {
    // Check if shelter already exists for this user
    const existingShelter = await Shelter.findOne({ user: req.user._id });
    if (existingShelter) {
      return res.status(400).json({ message: 'You already have a registered shelter' });
    }
    
    const {
      name,
      description,
      address,
      contactEmail,
      contactPhone,
      website,
      operatingHours,
      socialMedia
    } = req.body;
    
    // Upload logo
    let logoUrl = '';
    if (req.files.logo && req.files.logo.length > 0) {
      logoUrl = await uploadToCloudinary(req.files.logo[0].path);
      fs.unlinkSync(req.files.logo[0].path);
    }
    
    // Upload shelter images
    const imageUrls = [];
    if (req.files.images && req.files.images.length > 0) {
      for (const file of req.files.images) {
        const imageUrl = await uploadToCloudinary(file.path);
        imageUrls.push(imageUrl);
        fs.unlinkSync(file.path);
      }
    }
    
    // Upload verification documents
    const documentUrls = [];
    if (req.files.verificationDocuments && req.files.verificationDocuments.length > 0) {
      for (const file of req.files.verificationDocuments) {
        const documentUrl = await uploadToCloudinary(file.path);
        documentUrls.push(documentUrl);
        fs.unlinkSync(file.path);
      }
    }
    
    // Create shelter
    const shelter = new Shelter({
      name,
      user: req.user._id,
      description,
      address: JSON.parse(address),
      contactEmail: contactEmail || req.user.email,
      contactPhone,
      website,
      logo: logoUrl,
      images: imageUrls,
      operatingHours: operatingHours ? JSON.parse(operatingHours) : {},
      socialMedia: socialMedia ? JSON.parse(socialMedia) : {},
      verificationDocuments: documentUrls
    });
    
    // Save shelter
    await shelter.save();
    
    res.status(201).json(shelter);
  } catch (error) {
    console.error('Create shelter error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/shelters/:id
// @desc    Update a shelter
// @access  Private (Shelter owner or Admin)
router.put('/:id', auth, checkRole(['shelter', 'admin']), upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'images', maxCount: 5 },
  { name: 'verificationDocuments', maxCount: 3 }
]), async (req, res) => {
  try {
    const shelter = await Shelter.findById(req.params.id);
    
    if (!shelter) {
      return res.status(404).json({ message: 'Shelter not found' });
    }
    
    // Check authorization
    if (req.user.role === 'shelter' && shelter.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const updates = { ...req.body };
    
    // Handle JSON fields
    if (updates.address) updates.address = JSON.parse(updates.address);
    if (updates.operatingHours) updates.operatingHours = JSON.parse(updates.operatingHours);
    if (updates.socialMedia) updates.socialMedia = JSON.parse(updates.socialMedia);
    
    // Upload logo if provided
    if (req.files.logo && req.files.logo.length > 0) {
      updates.logo = await uploadToCloudinary(req.files.logo[0].path);
      fs.unlinkSync(req.files.logo[0].path);
    }
    
    // Upload new images if provided
    if (req.files.images && req.files.images.length > 0) {
      const newImageUrls = [];
      for (const file of req.files.images) {
        const imageUrl = await uploadToCloudinary(file.path);
        newImageUrls.push(imageUrl);
        fs.unlinkSync(file.path);
      }
      updates.images = [...shelter.images, ...newImageUrls];
    }
    
    // Upload new verification documents if provided
    if (req.files.verificationDocuments && req.files.verificationDocuments.length > 0) {
      const newDocUrls = [];
      for (const file of req.files.verificationDocuments) {
        const docUrl = await uploadToCloudinary(file.path);
        newDocUrls.push(docUrl);
        fs.unlinkSync(file.path);
      }
      updates.verificationDocuments = [...shelter.verificationDocuments, ...newDocUrls];
    }
    
    // Update shelter
    const updatedShelter = await Shelter.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );
    
    res.json(updatedShelter);
  } catch (error) {
    console.error('Update shelter error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/shelters/:id/review
// @desc    Add a review to a shelter
// @access  Private (Authenticated users)
router.post('/:id/review', auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    
    const shelter = await Shelter.findById(req.params.id);
    
    if (!shelter) {
      return res.status(404).json({ message: 'Shelter not found' });
    }
    
    // Check if user already reviewed
    const existingReview = shelter.reviews.find(
      review => review.user.toString() === req.user._id.toString()
    );
    
    if (existingReview) {
      // Update existing review
      existingReview.rating = rating;
      existingReview.comment = comment;
      existingReview.createdAt = Date.now();
    } else {
      // Add new review
      shelter.reviews.push({
        user: req.user._id,
        rating,
        comment
      });
    }
    
    // Save shelter with new/updated review
    await shelter.save();
    
    res.json(shelter);
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/shelters/:id/verify
// @desc    Verify a shelter
// @access  Private (Admin only)
router.put('/:id/verify', auth, checkRole(['admin']), async (req, res) => {
  try {
    const shelter = await Shelter.findById(req.params.id);
    
    if (!shelter) {
      return res.status(404).json({ message: 'Shelter not found' });
    }
    
    shelter.isVerified = true;
    await shelter.save();
    
    res.json({ message: 'Shelter verified successfully', shelter });
  } catch (error) {
    console.error('Verify shelter error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/shelters/:id
// @desc    Delete a shelter
// @access  Private (Shelter owner or Admin)
router.delete('/:id', auth, checkRole(['shelter', 'admin']), async (req, res) => {
  try {
    const shelter = await Shelter.findById(req.params.id);
    if (!shelter) {
      return res.status(404).json({ message: 'Shelter not found' });
    }

    await shelter.remove();
    res.json({ message: 'Shelter deleted successfully' });
  } catch (error) {
    console.error('Error deleting shelter:', error);
    res.status(500).json({ message: 'Error deleting shelter' });
  }
});

module.exports = router; 