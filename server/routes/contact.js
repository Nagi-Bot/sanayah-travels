const express = require('express');
const router = express.Router();
const Setting = require('../models/Setting');

// POST /api/contact/submit - contact form submission
router.post('/submit', async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone required' });
    }
    if (!req.dbConnected) return res.json({ success: true, cached: true });

    const existing = await Setting.findOne({ key: 'contact_submissions' });
    const submissions = existing ? existing.value : [];
    submissions.unshift({
      name: name.trim(),
      email: (email || '').trim(),
      phone: phone.trim(),
      service: (service || '').trim(),
      message: (message || '').trim(),
      time: new Date()
    });
    if (submissions.length > 100) submissions.length = 100;

    await Setting.findOneAndUpdate(
      { key: 'contact_submissions' },
      { value: submissions },
      { upsert: true }
    );

    res.json({ success: true });
  } catch (err) {
    res.json({ success: true, cached: true });
  }
});

// GET /api/contact/submissions - admin view submissions
router.get('/submissions', require('../middleware/auth'), async (req, res) => {
  try {
    if (!req.dbConnected) return res.json([]);
    const setting = await Setting.findOne({ key: 'contact_submissions' });
    res.json(setting ? setting.value : []);
  } catch (err) {
    res.json([]);
  }
});

module.exports = router;
