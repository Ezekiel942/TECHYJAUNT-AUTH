const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config();
// Connect to MongoDB database
const connectDB = async () => {
  const uri = "mongodb://localhost:27017/here";
  await mongoose.connect(uri);
  console.log("MongoDB connected");
};

module.exports = connectDB;
