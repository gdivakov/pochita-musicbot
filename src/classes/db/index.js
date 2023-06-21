require('module-alias/register');
require('dotenv').config();
const mongoose = require('mongoose');
const Track = require('@db/models/track');

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
                await mongoose.connect(this.DB_URI)

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
        await this.connect()

        const allTracks = await Track.find();

        await this.disconnect();
        return allTracks;
    }

    getAllPlaylists() {

    }

    getTracksByPlaylist() {

    }

    // Save
    saveToPlaylist() {

    }

    createPlaylist() {

    }

    deleteFromPlaylist() {

    }

    editTrackMetadata() {

    }

    editPlaylistMetadata() {

    }

}

const db = new Database();

module.exports = db;