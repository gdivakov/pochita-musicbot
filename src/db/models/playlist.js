const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
	title: { type: String, required: true, unique: true },
	author: String,
	trackCount: Number,
	length: Number,
});

module.exports = mongoose.model('Playlist', playlistSchema);