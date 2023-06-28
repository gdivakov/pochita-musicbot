const mongoose = require('mongoose');

const trackSchema = new mongoose.Schema({
	playlistTitle: String,
	title: String,
	URL: String,
	thumbnailURL: String,
	author: String,
});

module.exports = mongoose.model('Track', trackSchema);