require('module-alias/register');
require('dotenv').config();
const mongoose = require('mongoose');
const { ERROR_MESSAGE } = require('@consts/message');
const Track = require('@db/models/track');
const Playlist = require('@db/models/playlist');
const { databaseProxyHandler, initDBErrorHandler } = require('@classes/db/utils');

const {
	MONGO_DB_USERNAME,
	MONGO_DB_PASSWORD,
	MONGO_DB_HOST
} = process.env;

class Database {
	DB_URI = `mongodb://${MONGO_DB_USERNAME}:${MONGO_DB_PASSWORD}@${MONGO_DB_HOST}:27017/pochita-musicbot?authSource=admin`;
	isConnected = false;

	async connect() {
		try {
			if (!this.isConnected) {
				await mongoose.connect(this.DB_URI);

				this.isConnected = true;
				console.log('Connected to the database');
			}
		} catch (error) {
			console.error('Error connecting to the database:', error.message);
		}
	}

	async disconnect() {
		if (this.isConnected) {
			await mongoose.disconnect();

			this.isConnected = false;
			console.log('Disconnected from the database');
		}
	}

	// Get
	async getAllTracks() {
		const allTracks = await Track.find();

		return allTracks;
	}

	async getPlaylists() {
		const allPlaylists = await Playlist.find();
		return allPlaylists;
	}

	async getPlaylistTracks(selectedPlaylistTitle) {
		const playlistTracks = await Track.find({ playlistTitle: selectedPlaylistTitle });
		return playlistTracks;
	}

	getTracksByPlaylist() {

	}

	// Save
	async saveTrack(track, playlistTitle) {
		const { url: URL, title, thumbnail: thumbnailURL, author } = track;

		const trackToSave = new Track({ title, URL, thumbnailURL, playlistTitle, author });

		await trackToSave.save();
	}

	async createPlaylist(playlistTitle) {
		const playlist = new Playlist({ title: playlistTitle });

		try {
			await playlist.save();
		} catch (error) {
			if (error.code === 11000 && error.keyPattern && error.keyPattern.title) {
				return { status: false, errorMessage: ERROR_MESSAGE.PLAYLIST.CREATE.UNIQUE_TITLE };
			}
		}
	}

	deleteFromPlaylist() {

	}

	editTrackMetadata() {

	}

	editPlaylistMetadata() {

	}

}


const DBProxy = new Proxy(new Database(), databaseProxyHandler);

initDBErrorHandler();

DBProxy.connect();

module.exports = DBProxy;
