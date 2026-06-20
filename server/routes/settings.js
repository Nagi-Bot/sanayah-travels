const express = require('express');
const router = express.Router();
const Setting = require('../models/Setting');
const auth = require('../middleware/auth');

const SETTING_KEYS = [
  'sanayah_contact', 'sanayah_social', 'sanayah_wa', 'sanayah_logo', 'sanayah_iata',
  'sanayah_seo', 'sanayah_pages', 'sanayah_about', 'sanayah_popup', 'sanayah_accent',
  'sanayah_announcement', 'sanayah_hero_title', 'sanayah_hero_sub', 'sanayah_site_name',
  'sanayah_chatconfig', 'sanayah_email', 'sanayah_faq'
];

// GET /api/settings/:key - public get single setting
router.get('/:key', async (req, res) => {
  try {
    if (!req.dbConnected) return res.json(null);
    if (SETTING_KEYS.includes(req.params.key) || req.params.key.startsWith('sanayah_')) {
      const setting = await Setting.findOne({ key: req.params.key });
      res.json(setting ? setting.value : null);
    } else {
      res.status(403).json({ error: 'Not allowed' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/settings - admin get all settings
router.get('/', auth, async (req, res) => {
  try {
    if (!req.dbConnected) return res.json(null);
    const settings = await Setting.find();
    const result = {};
    settings.forEach(s => { result[s.key] = s.value; });
    res.json(result);
  } catch (err) {
    res.json(null);
  }
});

// PUT /api/settings/:key - admin save setting
router.put('/:key', auth, async (req, res) => {
  try {
    const { value } = req.body;
    await Setting.findOneAndUpdate(
      { key: req.params.key },
      { value },
      { upsert: true }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
