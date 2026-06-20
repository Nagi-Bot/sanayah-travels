const express = require('express');
const router = express.Router();
const Setting = require('../models/Setting');
const auth = require('../middleware/auth');

// GET /api/pages - public
router.get('/', async (req, res) => {
  try {
    if (!req.dbConnected) return res.json(null);
    const setting = await Setting.findOne({ key: 'sanayah_pages' });
    res.json(setting ? setting.value : {});
  } catch (err) {
    res.json(null);
  }
});

// PUT /api/pages - admin save
router.put('/', auth, async (req, res) => {
  try {
    const { value } = req.body;
    await Setting.findOneAndUpdate(
      { key: 'sanayah_pages' },
      { value },
      { upsert: true }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
