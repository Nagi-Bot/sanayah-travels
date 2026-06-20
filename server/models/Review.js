const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, default: '' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  text: { type: String, default: '' },
  approved: { type: Boolean, default: false },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);
