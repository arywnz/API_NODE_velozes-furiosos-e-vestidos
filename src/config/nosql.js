const mongoose = require('mongoose');
require('dotenv').config();

const connectMongoDB = async () => {
  const isTest = process.env.NODE_ENV === 'test';
  const defaultUri = isTest
    ? 'mongodb://localhost:27017/db_recursos_test'
    : 'mongodb://mongodb:27017/db_recursos';
  
  const mongoUri = process.env.MONGO_URI || defaultUri;

  try {
    await mongoose.connect(mongoUri);
  } catch (error) {
    if (!isTest) {
      process.exit(1);
    }
    throw error;
  }
};

const disconnectMongoDB = async () => {
  await mongoose.disconnect();
};

module.exports = { connectMongoDB, disconnectMongoDB };
