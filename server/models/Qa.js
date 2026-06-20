const mongoose = require('mongoose');

const qaSchema = new mongoose.Schema({
  key: { type: String, required: true },
  reply: { type: String, required: true }
});

module.exports = mongoose.model('Qa', qaSchema);
