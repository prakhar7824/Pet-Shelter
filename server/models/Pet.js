const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  species: {
    type: String,
    required: true,
    enum: ['dog', 'cat', 'bird', 'rabbit', 'hamster', 'guinea pig', 'fish', 'turtle', 'other'],
    lowercase: true
  },
  breed: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    value: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      enum: ['days', 'weeks', 'months', 'years'],
      required: true
    }
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'unknown'],
    required: true
  },
  size: {
    type: String,
    enum: ['small', 'medium', 'large', 'extra large'],
    required: true
  },
  color: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  medicalHistory: {
    vaccinated: {
      type: Boolean,
      default: false
    },
    neutered: {
      type: Boolean,
      default: false
    },
    microchipped: {
      type: Boolean,
      default: false
    },
    specialNeeds: {
      type: Boolean,
      default: false
    },
    specialNeedsDescription: String,
    allergies: [String],
    currentMedications: [String]
  },
  behavior: {
    goodWithKids: {
      type: Boolean,
      default: true
    },
    goodWithDogs: {
      type: Boolean,
      default: true
    },
    goodWithCats: {
      type: Boolean,
      default: true
    },
    houseTrained: {
      type: Boolean,
      default: false
    },
    energyLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    temperament: [String]
  },
  images: {
    type: [String],
    required: true
  },
  adoptionFee: {
    type: Number,
    default: 0
  },
  shelter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shelter',
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'pending', 'adopted'],
    default: 'available'
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create indexes for common queries
petSchema.index({ species: 1 });
petSchema.index({ breed: 1 });
petSchema.index({ status: 1 });
petSchema.index({ 'age.value': 1, 'age.unit': 1 });
petSchema.index({ size: 1 });
petSchema.index({ shelter: 1 });

const Pet = mongoose.model('Pet', petSchema);

module.exports = Pet; 