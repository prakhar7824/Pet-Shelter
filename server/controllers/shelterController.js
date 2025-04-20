const Shelter = require('../models/Shelter');

// Get all shelters
exports.getAllShelters = async (req, res) => {
  try {
    const shelters = await Shelter.find()
      .select('-verificationDocuments')
      .sort({ rating: -1, createdAt: -1 });
    res.status(200).json(shelters);
  } catch (error) {
    console.error('Error fetching shelters:', error);
    res.status(500).json({ message: 'Error fetching shelters', error: error.message });
  }
};

// Get a single shelter by ID
exports.getShelterById = async (req, res) => {
  try {
    const shelter = await Shelter.findById(req.params.id)
      .select('-verificationDocuments');
    
    if (!shelter) {
      return res.status(404).json({ message: 'Shelter not found' });
    }
    
    res.status(200).json(shelter);
  } catch (error) {
    console.error('Error fetching shelter:', error);
    res.status(500).json({ message: 'Error fetching shelter', error: error.message });
  }
};

// Create a new shelter
exports.createShelter = async (req, res) => {
  try {
    const shelterData = req.body;
    
    // Check if shelter with same email already exists
    const existingShelter = await Shelter.findOne({ 'contact.email': shelterData.contact.email });
    if (existingShelter) {
      return res.status(400).json({ message: 'A shelter with this email already exists' });
    }
    
    const shelter = new Shelter(shelterData);
    await shelter.save();
    
    res.status(201).json({
      message: 'Shelter created successfully',
      shelter: shelter
    });
  } catch (error) {
    console.error('Error creating shelter:', error);
    res.status(500).json({ message: 'Error creating shelter', error: error.message });
  }
};

// Update a shelter
exports.updateShelter = async (req, res) => {
  try {
    const shelterId = req.params.id;
    const updates = req.body;
    
    // Remove fields that shouldn't be updated
    delete updates.rating;
    delete updates.reviews;
    delete updates.createdAt;
    
    const shelter = await Shelter.findByIdAndUpdate(
      shelterId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-verificationDocuments');
    
    if (!shelter) {
      return res.status(404).json({ message: 'Shelter not found' });
    }
    
    res.status(200).json({
      message: 'Shelter updated successfully',
      shelter: shelter
    });
  } catch (error) {
    console.error('Error updating shelter:', error);
    res.status(500).json({ message: 'Error updating shelter', error: error.message });
  }
};

// Delete a shelter
exports.deleteShelter = async (req, res) => {
  try {
    const shelter = await Shelter.findByIdAndDelete(req.params.id);
    
    if (!shelter) {
      return res.status(404).json({ message: 'Shelter not found' });
    }
    
    res.status(200).json({ message: 'Shelter deleted successfully' });
  } catch (error) {
    console.error('Error deleting shelter:', error);
    res.status(500).json({ message: 'Error deleting shelter', error: error.message });
  }
};

// Add a review to a shelter
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const userId = req.user.id; // From auth middleware
    
    const shelter = await Shelter.findById(req.params.id);
    if (!shelter) {
      return res.status(404).json({ message: 'Shelter not found' });
    }
    
    // Check if user has already reviewed this shelter
    const existingReview = shelter.reviews.find(review => 
      review.user.toString() === userId
    );
    
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this shelter' });
    }
    
    // Add new review
    shelter.reviews.push({
      user: userId,
      rating,
      comment
    });
    
    // Update average rating
    const totalRating = shelter.reviews.reduce((sum, review) => sum + review.rating, 0);
    shelter.rating = totalRating / shelter.reviews.length;
    
    await shelter.save();
    
    res.status(201).json({
      message: 'Review added successfully',
      shelter: shelter
    });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Error adding review', error: error.message });
  }
}; 