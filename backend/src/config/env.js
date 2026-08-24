const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/society_maintenance_db',
  jwtSecret: process.env.JWT_SECRET || 'super_secret_society_maintenance_jwt_key_987654321',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
    url: process.env.CLOUDINARY_URL || ''
  },
  outbox: {
    pollIntervalMs: parseInt(process.env.OUTBOX_POLL_INTERVAL_MS, 10) || 5000,
    maxAttempts: 5
  },
  riskScoring: {
    decayConstant: 0.0231, // lambda = ln(2) / 30 ~ 0.0231 (30-day half-life)
    windowDays: 90,
    thresholdScore: 3.0,
    defaultSeverityWeight: 3.0
  }
};

module.exports = config;
