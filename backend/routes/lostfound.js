const express = require('express');
const LostFound = require('../models/LostFound');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Get all lost/found items
router.get('/', auth, async (req, res) => {
  try {
    const { type, category, status = 'active', page = 1, limit = 10 } = req.query;
    
    let filter = { status };
    
    if (type && type !== 'all') {
      filter.type = type;
    }
    
    if (category && category !== 'all') {
      filter.category = category;
    }

    const items = await LostFound.find(filter)
      .populate('postedBy', 'name email')
      .populate('comments.user', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await LostFound.countDocuments(filter);

    res.json({
      items,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create lost/found item
router.post('/', auth, async (req, res) => {
  try {
    const item = new LostFound({
      ...req.body,
      postedBy: req.user._id
    });

    await item.save();
    await item.populate('postedBy', 'name email');

    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add comment to item
router.post('/:id/comments', auth, async (req, res) => {
  try {
    const { text } = req.body;
    
    const item = await LostFound.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    item.comments.push({
      user: req.user._id,
      text
    });

    await item.save();
    await item.populate('comments.user', 'name');

    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update item status
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    
    const item = await LostFound.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Only item owner can update status
    if (item.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    item.status = status;
    await item.save();

    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
