const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email']
  },
  name: {
    type: String,
    required: true
  },
  googleId: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['student', 'admin', 'placement_officer'],
    default: 'student'
  },
  studentInfo: {
    year: {
      type: Number,
      min: 1,
      max: 4
    },
    branch: {
      type: String,
      enum: ['CSE', 'ECE', 'ME', 'CE', 'EE', 'IT']
    },
    section: {
      type: String,
      enum: ['A', 'B', 'C', 'D']
    },
    rollNumber: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
