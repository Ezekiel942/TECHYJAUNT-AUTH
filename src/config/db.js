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
    // Mongoose v6+ uses sensible defaults; specify a short serverSelectionTimeout for faster failure on deploy
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('MongoDB connected');
  } catch (err) {
    // Provide a clearer message for the common Atlas issue (IP whitelist / network access)
    console.error('Failed to connect to MongoDB:', err.message || err);
    if (err && err.name === 'MongooseServerSelectionError') {
      console.error('\nIt looks like Mongoose cannot reach your MongoDB Atlas cluster. Common causes:');
      console.error('- The Atlas cluster IP whitelist does not include Render / your server IPs.');
      console.error("  * In Atlas: Network Access -> Add IP Address -> 0.0.0.0/0 (for testing) or add Render's outbound IPs (recommended)");
      console.error("- The connection string (MONGODB_URI) is incorrect or missing the database name. Use: mongodb+srv://USER:PASS@cluster0.xxxx.mongodb.net/DBNAME?retryWrites=true&w=majority");
      console.error('\nSet the correct `MONGODB_URI` in Render environment variables and redeploy.');
    }
    // Re-throw so index.js can exit if desired
    throw err;
  }
};

module.exports = connectDB;
