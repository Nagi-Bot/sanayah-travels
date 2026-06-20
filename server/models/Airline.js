const mongoose = require('mongoose');

const airlineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  data: { type: String, default: '' },
  logo: { type: String, default: '' }
});

module.exports = mongoose.model('Airline', airlineSchema);
