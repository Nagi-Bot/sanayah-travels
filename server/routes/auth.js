const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Setting = require('../models/Setting');

const JWT_SECRET = process.env.JWT_SECRET || 'sanayah-default-secret-change-me';

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const adminUser = process.env.ADMIN_USERNAME || 'admin';
    const adminPass = process.env.ADMIN_PASSWORD || 'admin123';

    // Check if custom password is set in DB
    let storedPass = adminPass;
    if (req.dbConnected) {
      try {
        const passSetting = await Setting.findOne({ key: 'admin_password' });
        if (passSetting) {
          storedPass = passSetting.value;
        }
      } catch(e) {}
    }

    if (username !== adminUser) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = (password === storedPass) || bcrypt.compareSync(password, storedPass);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const payload = { admin: username };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/auth/change-password
router.post('/change-password', require('../middleware/auth'), async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password required' });
    }
    if (!req.dbConnected) return res.json({ success: true, cached: true });

    const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
    let storedPass = adminPass;
    try {
      const passSetting = await Setting.findOne({ key: 'admin_password' });
      if (passSetting) {
        storedPass = passSetting.value;
      }
    } catch(e) {}

    const isMatch = (currentPassword === storedPass) || bcrypt.compareSync(currentPassword, storedPass);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashed = bcrypt.hashSync(newPassword, salt);

    await Setting.findOneAndUpdate(
      { key: 'admin_password' },
      { value: hashed },
      { upsert: true }
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
