const mongoose = require('mongoose');

const adoptionSchema = new mongoose.Schema({
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true
  },
  adopter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  shelter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shelter',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed', 'canceled'],
    default: 'pending'
  },
  applicationDetails: {
    housingType: {
      type: String,
      enum: ['house', 'apartment', 'condo', 'other'],
      required: true
    },
    hasYard: {
      type: Boolean,
      required: true
    },
    hasChildren: {
      type: Boolean,
      required: true
    },
    hasOtherPets: {
      type: Boolean,
      required: true
    },
    otherPetDetails: String,
    workSchedule: String,
    experienceWithPets: String,
    reasonForAdoption: {
      type: String,
      required: true
    },
    additionalInfo: String
  },
  reviewNotes: {
    type: String,
    default: ''
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,
  completedAt: Date,
  meetingSchedule: Date,
  homeVisitSchedule: Date,
  adoptionFee: {
    amount: Number,
    paid: {
      type: Boolean,
      default: false
    },
    paymentMethod: String,
    paymentDate: Date,
    transactionId: String
  }
}, {
  timestamps: true
});

// Index for frequent queries
adoptionSchema.index({ pet: 1 });
adoptionSchema.index({ adopter: 1 });
adoptionSchema.index({ shelter: 1 });
adoptionSchema.index({ status: 1 });
adoptionSchema.index({ createdAt: 1 });

const Adoption = mongoose.model('Adoption', adoptionSchema);

module.exports = Adoption; 