const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['placement', 'academic', 'event', 'general'],
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetAudience: {
    year: [Number],
    branch: [String],
    section: [String]
  },
  attachments: [{
    filename: String,
    url: String,
    fileType: String
  }],
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  expiryDate: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('Notice', noticeSchema);
