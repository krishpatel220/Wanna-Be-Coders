const mongoose = require('mongoose');
const env = require('./env');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Fail fast if DB is unreachable
    });

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error(`❌ MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });

    return conn;
  } catch (error) {
    console.error(`⚠️  MongoDB connection failed: ${error.message}`);
    console.warn('⚠️  Server will start WITHOUT database. Auth endpoints will not work until MongoDB is connected.');
    console.warn('   Set MONGODB_URI in .env to a valid MongoDB connection string.');
    return null;
  }
};

module.exports = connectDB;
