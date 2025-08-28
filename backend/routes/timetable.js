const express = require('express');
const Timetable = require('../models/Timetable');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get timetable for student
router.get('/my-timetable', auth, async (req, res) => {
  try {
    const user = req.user;
    
    if (user.role !== 'student' || !user.studentInfo) {
      return res.status(400).json({ message: 'Student information required' });
    }

    const { year, branch, section } = user.studentInfo;
    
    const timetable = await Timetable.findOne({
      year,
      branch,
      section
    }).populate('createdBy', 'name email');

    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found for your class' });
    }

    res.json(timetable);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get specific timetable
router.get('/:year/:branch/:section', auth, async (req, res) => {
  try {
    const { year, branch, section } = req.params;
    
    const timetable = await Timetable.findOne({
      year: parseInt(year),
      branch: branch.toUpperCase(),
      section: section.toUpperCase()
    }).populate('createdBy', 'name email');

    if (!timetable) {
      return res.status(404).json({ message: 'Timetable not found' });
    }

    res.json(timetable);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create/Update timetable (admin only)
router.post('/', auth, adminAuth, async (req, res) => {
  try {
    const { year, branch, section } = req.body;
    
    let timetable = await Timetable.findOne({ year, branch, section });
    
    if (timetable) {
      // Update existing timetable
      timetable = await Timetable.findByIdAndUpdate(
        timetable._id,
        { ...req.body, createdBy: req.user._id },
        { new: true, runValidators: true }
      );
    } else {
      // Create new timetable
      timetable = new Timetable({
        ...req.body,
        createdBy: req.user._id
      });
      await timetable.save();
    }

    await timetable.populate('createdBy', 'name email');
    res.status(201).json(timetable);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
