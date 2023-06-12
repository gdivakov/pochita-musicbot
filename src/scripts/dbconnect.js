require('dotenv').config();
const mongoose = require('mongoose');

const {
  MONGO_DB_USERNAME,
  MONGO_DB_PASSWORD,
  MONGO_DB_HOST
} = process.env;

const DB_URI = `mongodb://${MONGO_DB_USERNAME}:${MONGO_DB_PASSWORD}@${MONGO_DB_HOST}:27017/pochita-musicbot?authSource=admin`;

module.exports = async function() {
  await mongoose.connect(DB_URI);
  console.log("Connected to DB");
}