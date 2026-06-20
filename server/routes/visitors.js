const express = require('express');
const router = express.Router();
const Visitor = require('../models/Visitor');
const auth = require('../middleware/auth');

// POST /api/visitors - track visitor
router.post('/', async (req, res) => {
  try {
    if (!req.dbConnected) return res.json({ success: true, cached: true });
    const { ip, country, city, region, page } = req.body;
    const visitor = new Visitor({
      ip: ip || req.ip || '',
      country: country || '',
      city: city || '',
      region: region || '',
      page: page || '',
      time: new Date()
    });
    await visitor.save();

    const count = await Visitor.countDocuments();
    if (count > 100) {
      const oldest = await Visitor.find().sort({ time: 1 }).limit(count - 100);
      if (oldest.length) {
        await Visitor.deleteMany({ _id: { $in: oldest.map(o => o._id) } });
      }
    }
    res.json({ success: true });
  } catch (err) {
    res.json({ success: true, cached: true });
  }
});

// GET /api/visitors - admin get visitors
router.get('/', auth, async (req, res) => {
  try {
    if (!req.dbConnected) return res.json([]);
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    const visitors = await Visitor.find().sort({ time: -1 }).limit(limit);
    res.json(visitors);
  } catch (err) {
    res.json([]);
  }
});

module.exports = router;
