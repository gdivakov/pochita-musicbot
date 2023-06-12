require('dotenv').config();
const mongoose = require('mongoose');
const Playlist = require('/src/db/models/playlist')

const {
  MONGO_DB_USERNAME,
  MONGO_DB_PASSWORD,
  MONGO_DB_HOST
} = process.env;

const DB_URI = `mongodb://${MONGO_DB_USERNAME}:${MONGO_DB_PASSWORD}@${MONGO_DB_HOST}:27017/pochita-musicbot?authSource=admin`;

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(DB_URI);
  console.log("connected");
}