const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth, checkRole } = require('../middleware/auth');
const { upload, uploadToCloudinary } = require('../middleware/upload');
const fs = require('fs');

// @route   GET /api/users/profile
// @desc    Get current user's profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('savedPets', 'name species breed images status')
      .populate({
        path: 'adoptionHistory',
        populate: {
          path: 'pet',
          select: 'name species breed images'
        }
      });
    
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, upload.single('profilePicture'), async (req, res) => {
  try {
    const updates = { ...req.body };
    
    // Handle address object if provided
    if (updates.address) {
      try {
        updates.address = JSON.parse(updates.address);
      } catch (e) {
        return res.status(400).json({ message: 'Invalid address format' });
      }
    }
    
    // Update profile picture if provided
    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file.path);
      updates.profilePicture = imageUrl;
      fs.unlinkSync(req.file.path);
    }
    
    // We don't want to update these fields directly
    delete updates.password;
    delete updates.role;
    delete updates.email; // Email changes should be handled separately with verification
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/password
// @desc    Update password
// @access  Private
router.put('/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required' });
    }
    
    // Validate new password
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    
    // Get user with password
    const user = await User.findById(req.user._id);
    
    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/users/save-pet/:petId
// @desc    Save a pet to user's saved pets
// @access  Private
router.post('/save-pet/:petId', auth, async (req, res) => {
  try {
    const petId = req.params.petId;
    const user = await User.findById(req.user._id);
    
    // Check if pet is already saved
    if (user.savedPets.includes(petId)) {
      return res.status(400).json({ message: 'Pet is already saved' });
    }
    
    // Add pet to saved pets
    user.savedPets.push(petId);
    await user.save();
    
    res.json({ message: 'Pet saved successfully' });
  } catch (error) {
    console.error('Save pet error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/users/save-pet/:petId
// @desc    Remove a pet from user's saved pets
// @access  Private
router.delete('/save-pet/:petId', auth, async (req, res) => {
  try {
    const petId = req.params.petId;
    
    // Remove pet from saved pets
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { savedPets: petId }
    });
    
    res.json({ message: 'Pet removed from saved pets' });
  } catch (error) {
    console.error('Remove saved pet error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ADMIN ROUTES

// @route   GET /api/users
// @desc    Get all users (admin only)
// @access  Private (Admin only)
router.get('/', auth, checkRole(['admin']), async (req, res) => {
  try {
    const { role, search, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (role) {
      filter.role = role;
    }
    
    // Search by name or email
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query with pagination
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const total = await User.countDocuments(filter);
    
    res.json({
      users,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/:id/role
// @desc    Update user role (admin only)
// @access  Private (Admin only)
router.put('/:id/role', auth, checkRole(['admin']), async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['adopter', 'shelter', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;