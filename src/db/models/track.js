const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema({
  title: String,
  URL: String,
  length: Number,
  author: String,
});

module.exports = mongoose.model('Track', trackSchema);