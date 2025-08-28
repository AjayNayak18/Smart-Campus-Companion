const mongoose = require('mongoose');

const lostFoundSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  type: {
    type: String,
    enum: ['lost', 'found'],
    required: true
  },
  category: {
    type: String,
    enum: ['electronics', 'books', 'clothing', 'accessories', 'documents', 'other'],
    required: true
  },
  location: {
    type: String,
    required: true
  },
  images: [{
    url: String,
    publicId: String
  }],
  contactInfo: {
    phone: String,
    email: String
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'resolved', 'closed'],
    default: 'active'
  },
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('LostFound', lostFoundSchema);
