const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: true,
    min: 1,
    max: 4
  },
  branch: {
    type: String,
    required: true,
    enum: ['CSE', 'ECE', 'ME', 'CE', 'EE', 'IT']
  },
  section: {
    type: String,
    required: true,
    enum: ['A', 'B', 'C', 'D']
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  schedule: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      required: true
    },
    periods: [{
      subject: {
        type: String,
        required: true
      },
      teacher: {
        type: String,
        required: true
      },
      room: {
        type: String,
        required: true
      },
      startTime: {
        type: String,
        required: true
      },
      endTime: {
        type: String,
        required: true
      },
      type: {
        type: String,
        enum: ['lecture', 'lab', 'tutorial'],
        default: 'lecture'
      }
    }]
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Timetable', timetableSchema);
