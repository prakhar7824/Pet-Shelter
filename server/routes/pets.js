const express = require('express');
const router = express.Router();
const Pet = require('../models/Pet');
const Shelter = require('../models/Shelter');
const { auth, checkRole } = require('../middleware/auth');
const { upload, uploadToCloudinary } = require('../middleware/upload');
const fs = require('fs');
const path = require('path');

// @route   GET /api/pets
// @desc    Get all pets with optional filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      species, 
      breed, 
      age, 
      ageUnit, 
      size, 
      gender, 
      status = 'available',
      shelter,
      page = 1, 
      limit = 10 
    } = req.query;
    
    // Build filter object
    const filter = { status };
    
    if (species) filter.species = species;
    if (breed) filter.breed = { $regex: breed, $options: 'i' };
    if (gender) filter.gender = gender;
    if (size) filter.size = size;
    if (shelter) filter.shelter = shelter;
    
    // Age filter (more complex)
    if (age && ageUnit) {
      filter.age = {
        value: { $lte: parseInt(age) },
        unit: ageUnit
      };
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query with pagination
    const pets = await Pet.find(filter)
      .populate('shelter', 'name location')
      .sort({ featured: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await Pet.countDocuments(filter);
    
    res.json({
      pets,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get pets error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/pets/:id
// @desc    Get pet by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id)
      .populate('shelter', 'name description contactEmail contactPhone address operatingHours');
    
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    
    res.json(pet);
  } catch (error) {
    console.error('Get pet error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/pets
// @desc    Create a new pet listing
// @access  Private (Shelter only)
router.post('/', auth, checkRole(['shelter', 'admin']), upload.array('images', 5), async (req, res) => {
  try {
    const {
      name,
      species,
      breed,
      age,
      ageUnit,
      gender,
      size,
      color,
      description,
      adoptionFee,
      ...otherFields
    } = req.body;
    
    // Check if shelter exists
    let shelter;
    if (req.user.role === 'shelter') {
      shelter = await Shelter.findOne({ user: req.user._id });
    } else if (req.user.role === 'admin' && req.body.shelterId) {
      shelter = await Shelter.findById(req.body.shelterId);
    }
    
    if (!shelter) {
      return res.status(400).json({ message: 'Shelter not found' });
    }
    
    // Upload images to Cloudinary
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const imageUrl = await uploadToCloudinary(file.path);
        imageUrls.push(imageUrl);
        
        // Remove temp file
        fs.unlinkSync(file.path);
      }
    }
    
    // Create new pet
    const pet = new Pet({
      name,
      species,
      breed,
      age: {
        value: age,
        unit: ageUnit
      },
      gender,
      size,
      color,
      description,
      adoptionFee: adoptionFee || 0,
      images: imageUrls,
      shelter: shelter._id,
      ...otherFields
    });
    
    // Save pet
    await pet.save();
    
    // Add pet to shelter
    shelter.pets.push(pet._id);
    await shelter.save();
    
    res.status(201).json(pet);
  } catch (error) {
    console.error('Create pet error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/pets/:id
// @desc    Update a pet listing
// @access  Private (Shelter owner or Admin)
router.put('/:id', auth, checkRole(['shelter', 'admin']), upload.array('images', 5), async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    
    // Check authorization
    const shelter = await Shelter.findById(pet.shelter);
    if (req.user.role === 'shelter' && shelter.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Handle new images if any
    const imageUrls = [...pet.images];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const imageUrl = await uploadToCloudinary(file.path);
        imageUrls.push(imageUrl);
        
        // Remove temp file
        fs.unlinkSync(file.path);
      }
    }
    
    // Handle age field
    let age = pet.age;
    if (req.body.age && req.body.ageUnit) {
      age = {
        value: req.body.age,
        unit: req.body.ageUnit
      };
    }
    
    // Update pet
    const updatedPet = await Pet.findByIdAndUpdate(
      req.params.id,
      { 
        ...req.body,
        age,
        images: imageUrls
      },
      { new: true, runValidators: true }
    );
    
    res.json(updatedPet);
  } catch (error) {
    console.error('Update pet error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/pets/:id
// @desc    Delete a pet listing
// @access  Private (Shelter owner or Admin)
router.delete('/:id', auth, checkRole(['shelter', 'admin']), async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    
    // Check authorization
    const shelter = await Shelter.findById(pet.shelter);
    if (req.user.role === 'shelter' && shelter.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Remove pet
    await Pet.findByIdAndDelete(req.params.id);
    
    // Remove from shelter's pets array
    shelter.pets = shelter.pets.filter(p => p.toString() !== req.params.id);
    await shelter.save();
    
    res.json({ message: 'Pet removed' });
  } catch (error) {
    console.error('Delete pet error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 