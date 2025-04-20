const express = require('express');
const router = express.Router();
const Adoption = require('../models/Adoption');
const Pet = require('../models/Pet');
const Shelter = require('../models/Shelter');
const User = require('../models/User');
const Conversation = require('../models/Conversation');
const { auth, checkRole } = require('../middleware/auth');

// @route   GET /api/adoptions
// @desc    Get all adoptions for current user (or filtered by shelter if shelter role)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    // Build filter object based on user role
    let filter = {};
    
    if (req.user.role === 'adopter') {
      // Adopters can only see their own adoptions
      filter.adopter = req.user._id;
    } else if (req.user.role === 'shelter') {
      // Shelter users can only see adoptions for their shelter
      const shelter = await Shelter.findOne({ user: req.user._id });
      if (!shelter) {
        return res.status(404).json({ message: 'Shelter not found' });
      }
      filter.shelter = shelter._id;
    }
    
    // Add status filter if provided
    if (status) {
      filter.status = status;
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query with pagination
    const adoptions = await Adoption.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('pet', 'name species breed images')
      .populate('shelter', 'name contactEmail')
      .populate('adopter', 'name email');
    
    // Get total count for pagination
    const total = await Adoption.countDocuments(filter);
    
    res.json({
      adoptions,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get adoptions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/adoptions/:id
// @desc    Get adoption by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const adoption = await Adoption.findById(req.params.id)
      .populate('pet')
      .populate('shelter', 'name contactEmail contactPhone address')
      .populate('adopter', 'name email phoneNumber');
    
    if (!adoption) {
      return res.status(404).json({ message: 'Adoption request not found' });
    }
    
    // Check authorization based on role
    if (req.user.role === 'adopter' && adoption.adopter._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    if (req.user.role === 'shelter') {
      const shelter = await Shelter.findOne({ user: req.user._id });
      if (!shelter || shelter._id.toString() !== adoption.shelter._id.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
      }
    }
    
    res.json(adoption);
  } catch (error) {
    console.error('Get adoption error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/adoptions
// @desc    Create a new adoption request
// @access  Private (Adopter only)
router.post('/', auth, checkRole(['adopter']), async (req, res) => {
  try {
    const {
      petId,
      housingType,
      hasYard,
      hasChildren,
      hasOtherPets,
      otherPetDetails,
      workSchedule,
      experienceWithPets,
      reasonForAdoption,
      additionalInfo
    } = req.body;
    
    // Check if pet exists and is available
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    
    if (pet.status !== 'available') {
      return res.status(400).json({ message: 'This pet is not available for adoption' });
    }
    
    // Get shelter info
    const shelter = await Shelter.findById(pet.shelter);
    if (!shelter) {
      return res.status(404).json({ message: 'Shelter information not found' });
    }
    
    // Check if user already has a pending adoption for this pet
    const existingAdoption = await Adoption.findOne({
      pet: petId,
      adopter: req.user._id,
      status: 'pending'
    });
    
    if (existingAdoption) {
      return res.status(400).json({ message: 'You already have a pending adoption request for this pet' });
    }
    
    // Create new adoption request
    const adoption = new Adoption({
      pet: petId,
      adopter: req.user._id,
      shelter: pet.shelter,
      applicationDetails: {
        housingType,
        hasYard,
        hasChildren,
        hasOtherPets,
        otherPetDetails,
        workSchedule,
        experienceWithPets,
        reasonForAdoption,
        additionalInfo
      },
      adoptionFee: {
        amount: pet.adoptionFee
      }
    });
    
    // Save adoption request
    await adoption.save();
    
    // Update user's adoption history
    await User.findByIdAndUpdate(req.user._id, {
      $push: { adoptionHistory: adoption._id }
    });
    
    // Update pet status to 'pending' if shelter prefers
    // This is optional and depends on shelter policy
    // If you want to implement this, uncomment the following:
    /*
    pet.status = 'pending';
    await pet.save();
    */
    
    // Create a conversation for the adoption
    const conversation = new Conversation({
      participants: [req.user._id, shelter.user],
      pet: petId,
      adoption: adoption._id
    });
    
    await conversation.save();
    
    res.status(201).json(adoption);
  } catch (error) {
    console.error('Create adoption error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/adoptions/:id/status
// @desc    Update adoption status
// @access  Private (Shelter or Admin only)
router.put('/:id/status', auth, checkRole(['shelter', 'admin']), async (req, res) => {
  try {
    const { status, reviewNotes } = req.body;
    
    if (!['pending', 'approved', 'rejected', 'completed', 'canceled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const adoption = await Adoption.findById(req.params.id);
    
    if (!adoption) {
      return res.status(404).json({ message: 'Adoption request not found' });
    }
    
    // Check authorization for shelter users
    if (req.user.role === 'shelter') {
      const shelter = await Shelter.findOne({ user: req.user._id });
      if (!shelter || shelter._id.toString() !== adoption.shelter.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
      }
    }
    
    // Update status and related fields
    adoption.status = status;
    adoption.reviewNotes = reviewNotes || adoption.reviewNotes;
    adoption.reviewedBy = req.user._id;
    adoption.reviewedAt = Date.now();
    
    if (status === 'completed') {
      adoption.completedAt = Date.now();
      
      // Update pet status to adopted
      await Pet.findByIdAndUpdate(adoption.pet, { status: 'adopted' });
    }
    
    // Save updates
    await adoption.save();
    
    res.json(adoption);
  } catch (error) {
    console.error('Update adoption status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/adoptions/:id/schedule
// @desc    Schedule meeting or home visit
// @access  Private (Shelter only)
router.put('/:id/schedule', auth, checkRole(['shelter']), async (req, res) => {
  try {
    const { meetingSchedule, homeVisitSchedule } = req.body;
    
    if (!meetingSchedule && !homeVisitSchedule) {
      return res.status(400).json({ message: 'Either meeting or home visit schedule is required' });
    }
    
    const adoption = await Adoption.findById(req.params.id);
    
    if (!adoption) {
      return res.status(404).json({ message: 'Adoption request not found' });
    }
    
    // Check authorization
    const shelter = await Shelter.findOne({ user: req.user._id });
    if (!shelter || shelter._id.toString() !== adoption.shelter.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Update schedules
    if (meetingSchedule) {
      adoption.meetingSchedule = new Date(meetingSchedule);
    }
    
    if (homeVisitSchedule) {
      adoption.homeVisitSchedule = new Date(homeVisitSchedule);
    }
    
    // Save updates
    await adoption.save();
    
    res.json(adoption);
  } catch (error) {
    console.error('Schedule error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/adoptions/:id/payment
// @desc    Update payment information
// @access  Private (Shelter only)
router.put('/:id/payment', auth, checkRole(['shelter']), async (req, res) => {
  try {
    const { paid, paymentMethod, paymentDate, transactionId } = req.body;
    
    const adoption = await Adoption.findById(req.params.id);
    
    if (!adoption) {
      return res.status(404).json({ message: 'Adoption request not found' });
    }
    
    // Check authorization
    const shelter = await Shelter.findOne({ user: req.user._id });
    if (!shelter || shelter._id.toString() !== adoption.shelter.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Update payment information
    adoption.adoptionFee.paid = paid;
    
    if (paymentMethod) {
      adoption.adoptionFee.paymentMethod = paymentMethod;
    }
    
    if (paymentDate) {
      adoption.adoptionFee.paymentDate = new Date(paymentDate);
    }
    
    if (transactionId) {
      adoption.adoptionFee.transactionId = transactionId;
    }
    
    // Save updates
    await adoption.save();
    
    res.json(adoption);
  } catch (error) {
    console.error('Update payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 