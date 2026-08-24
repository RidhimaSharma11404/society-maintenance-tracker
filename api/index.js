const app = require('../backend/src/app');
const config = require('../backend/src/config/env');
const { connectDB } = require('../backend/src/config/db');
const seedData = require('../backend/src/seeds/seedData');
const mongoose = require('mongoose');

let isConnected = false;
let memoryServer = null;

async function ensureDb() {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  try {
    if (config.mongoUri && !config.mongoUri.includes('127.0.0.1')) {
      await connectDB(config.mongoUri);
      await seedData();
      isConnected = true;
    } else {
      // In-memory fallback
      if (!memoryServer) {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        memoryServer = await MongoMemoryServer.create();
        const memUri = memoryServer.getUri();
        await connectDB(memUri);
        await seedData();
        isConnected = true;
      }
    }
  } catch (err) {
    console.error('[Serverless DB Error]:', err);
  }
}

module.exports = async (req, res) => {
  await ensureDb();
  return app(req, res);
};
