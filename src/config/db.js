const mongoose = require('mongoose');

// Load environment variables early
require('dotenv').config();

/**
 * Connect to MongoDB.
 * Priority of connection string:
 *  1. process.env.MONGODB_URI (recommended for production)
 *  2. process.env.MONGO_URI
 *  3. Local dev fallback: 'mongodb://localhost:27017/here'
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/here';
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message || err);
    // Re-throw so the caller (index.js) can decide to exit or retry
    throw err;
  }
};

module.exports = connectDB;
