const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet'
  },
  adoption: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Adoption'
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  unreadCount: {
    type: Map,
    of: Number,
    default: {}
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation; 