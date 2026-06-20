const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  q: { type: String, required: true },
  a: { type: String, default: '' }
});

module.exports = mongoose.model('Faq', faqSchema);
