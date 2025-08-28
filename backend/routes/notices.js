const express = require('express');
const Notice = require('../models/Notice');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all notices with filtering
router.get('/', auth, async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    const user = req.user;

    let filter = { isActive: true };
    
    // Add category filter
    if (category && category !== 'all') {
      filter.category = category;
    }

    // Add expiry filter
    filter.$or = [
      { expiryDate: { $exists: false } },
      { expiryDate: { $gte: new Date() } }
    ];

    // Filter based on target audience
    if (user.role === 'student' && user.studentInfo) {
      filter.$or = [
        { 'targetAudience.year': { $in: [user.studentInfo.year] } },
        { 'targetAudience.branch': { $in: [user.studentInfo.branch] } },
        { 'targetAudience.section': { $in: [user.studentInfo.section] } },
        { targetAudience: { $exists: false } }
      ];
    }

    const notices = await Notice.find(filter)
      .populate('author', 'name email')
      .sort({ priority: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Notice.countDocuments(filter);

    res.json({
      notices,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create notice (admin only)
router.post('/', auth, adminAuth, async (req, res) => {
  try {
    const notice = new Notice({
      ...req.body,
      author: req.user._id
    });

    await notice.save();
    await notice.populate('author', 'name email');

    res.status(201).json(notice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update notice
router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'name email');

    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    res.json(notice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete notice
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    
    if (!notice) {
      return res.status(404).json({ message: 'Notice not found' });
    }

    res.json({ message: 'Notice deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
