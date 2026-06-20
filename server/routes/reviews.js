const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const auth = require('../middleware/auth');

// GET /api/reviews - public, returns approved reviews
router.get('/', async (req, res) => {
  try {
    if (!req.dbConnected) return res.json([]);
    const all = req.query.all === 'true';
    const filter = all ? {} : { approved: true };
    const reviews = await Review.find(filter).sort({ date: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/reviews - public submit review
router.post('/', async (req, res) => {
  try {
    const { name, city, rating, text } = req.body;
    if (!name || !rating) {
      return res.status(400).json({ error: 'Name and rating required' });
    }
    const review = new Review({
      name: name.trim(),
      city: (city || '').trim(),
      rating: Math.min(5, Math.max(1, rating)),
      text: (text || '').trim(),
      approved: false,
      status: 'pending'
    });
    if (!req.dbConnected) {
      return res.status(201).json({ name: name.trim(), city: (city || '').trim(), rating: Math.min(5, Math.max(1, rating)), text: (text || '').trim(), approved: false, status: 'pending', date: new Date().toISOString(), _cached: true });
    }
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/reviews/:id - admin approve/reject
router.put('/:id', auth, async (req, res) => {
  try {
    const { approved, status } = req.body;
    const update = {};
    if (approved !== undefined) update.approved = approved;
    if (status) update.status = status;

    const review = await Review.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!review) return res.status(404).json({ error: 'Review not found' });
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/reviews/:id - admin delete
router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ error: 'Review not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
