const express = require('express');
const router = express.Router();
const Airline = require('../models/Airline');
const auth = require('../middleware/auth');

// GET /api/airlines
router.get('/', async (req, res) => {
  try {
    if (!req.dbConnected) return res.json([]);
    const airlines = await Airline.find().sort({ name: 1 });
    res.json(airlines);
  } catch (err) {
    res.json([]);
  }
});

// POST /api/airlines - admin add
router.post('/', auth, async (req, res) => {
  try {
    const { name, data, logo } = req.body;
    if (!name) return res.status(400).json({ error: 'Name required' });
    const airline = new Airline({ name: name.trim(), data: data || '', logo: logo || '' });
    await airline.save();
    res.status(201).json(airline);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/airlines/:id - admin update
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, data, logo } = req.body;
    const update = {};
    if (name) update.name = name.trim();
    if (data !== undefined) update.data = data;
    if (logo !== undefined) update.logo = logo;

    const airline = await Airline.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!airline) return res.status(404).json({ error: 'Airline not found' });
    res.json(airline);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/airlines/:id - admin delete
router.delete('/:id', auth, async (req, res) => {
  try {
    const airline = await Airline.findByIdAndDelete(req.params.id);
    if (!airline) return res.status(404).json({ error: 'Airline not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
