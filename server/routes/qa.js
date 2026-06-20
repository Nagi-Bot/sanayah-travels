const express = require('express');
const router = express.Router();
const Qa = require('../models/Qa');
const auth = require('../middleware/auth');

// GET /api/qa
router.get('/', async (req, res) => {
  try {
    if (!req.dbConnected) return res.json([]);
    const qa = await Qa.find();
    res.json(qa);
  } catch (err) {
    res.json([]);
  }
});

// POST /api/qa - admin add
router.post('/', auth, async (req, res) => {
  try {
    const { key, reply } = req.body;
    if (!key || !reply) return res.status(400).json({ error: 'Key and reply required' });
    const qa = new Qa({ key: key.trim().toLowerCase(), reply: reply.trim() });
    await qa.save();
    res.status(201).json(qa);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/qa/:id - admin update
router.put('/:id', auth, async (req, res) => {
  try {
    const { key, reply } = req.body;
    const update = {};
    if (key) update.key = key.trim().toLowerCase();
    if (reply) update.reply = reply.trim();

    const qa = await Qa.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!qa) return res.status(404).json({ error: 'Q&A not found' });
    res.json(qa);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/qa/:id - admin delete
router.delete('/:id', auth, async (req, res) => {
  try {
    const qa = await Qa.findByIdAndDelete(req.params.id);
    if (!qa) return res.status(404).json({ error: 'Q&A not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
