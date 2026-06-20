const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  ip: { type: String, default: '' },
  country: { type: String, default: '' },
  city: { type: String, default: '' },
  region: { type: String, default: '' },
  page: { type: String, default: '' },
  time: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Visitor', visitorSchema);
