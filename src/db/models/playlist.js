const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
  title: String,
  author: String,
  trackCount: Number,
  length: Number,
});

module.exports = Playlist;