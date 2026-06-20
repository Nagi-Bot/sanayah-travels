const express = require('express');
const router = express.Router();
const Faq = require('../models/Faq');
const auth = require('../middleware/auth');

// GET /api/faq
router.get('/', async (req, res) => {
  try {
    if (!req.dbConnected) return res.json([]);
    const faqs = await Faq.find();
    res.json(faqs);
  } catch (err) {
    res.json([]);
  }
});

// POST /api/faq - admin add
router.post('/', auth, async (req, res) => {
  try {
    const { q, a } = req.body;
    if (!q) return res.status(400).json({ error: 'Question required' });
    const faq = new Faq({ q: q.trim(), a: (a || '').trim() });
    await faq.save();
    res.status(201).json(faq);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/faq/:id - admin update
router.put('/:id', auth, async (req, res) => {
  try {
    const { q, a } = req.body;
    const update = {};
    if (q) update.q = q.trim();
    if (a !== undefined) update.a = a.trim();

    const faq = await Faq.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!faq) return res.status(404).json({ error: 'FAQ not found' });
    res.json(faq);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/faq/:id - admin delete
router.delete('/:id', auth, async (req, res) => {
  try {
    const faq = await Faq.findByIdAndDelete(req.params.id);
    if (!faq) return res.status(404).json({ error: 'FAQ not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
