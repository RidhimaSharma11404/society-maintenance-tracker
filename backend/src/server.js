const app = require('./app');
const config = require('./config/env');
const { connectDB, disconnectDB } = require('./config/db');
const { probeTransactionSupport } = require('./utils/transactionManager');
const settingsService = require('./services/settingsService');
const outboxWorker = require('./events/outboxWorker');

let server;
let memoryServer = null;

// Database readiness state and promise resolver
let isDbReady = false;
let dbReadyResolve;
const dbReadyPromise = new Promise((resolve) => {
  dbReadyResolve = resolve;
});

// Middleware to queue/await database readiness for incoming API requests
app.use(async (req, res, next) => {
  if (req.path === '/api/health') {
    return res.status(200).json({
      status: isDbReady ? 'UP' : 'INITIALIZING_DATABASE',
      timestamp: new Date().toISOString()
    });
  }

  if (!isDbReady) {
    console.log(`[API Gateway] Request to '${req.originalUrl}' waiting for database initialization...`);
    await dbReadyPromise;
  }
  next();
});

// Start HTTP Listener immediately on port 5000 so the port is open
server = app.listen(config.port, () => {
  console.log(`=======================================================`);
  console.log(` Greenwood Heights Ops API Server is LIVE`);
  console.log(` Port: ${config.port} | Environment: ${config.nodeEnv}`);
  console.log(` API Base: http://localhost:${config.port}/api`);
  console.log(` Health Check: http://localhost:${config.port}/api/health`);
  console.log(`=======================================================`);
});

async function initDatabase() {
  try {
    let connected = false;

    // 1. Attempt connection to configured MongoDB URI
    try {
      console.log(`[Database] Attempting connection to ${config.mongoUri}...`);
      await connectDB(config.mongoUri);
      connected = true;
    } catch (dbErr) {
      console.warn(`[Database Warning] Could not connect to external MongoDB: ${dbErr.message}`);
      console.log('[Database Engine] Initializing embedded in-memory database server for zero-config demonstration...');
      
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        memoryServer = await MongoMemoryServer.create();
        const memUri = memoryServer.getUri();
        await connectDB(memUri);
        connected = true;
        console.log(`[Database Engine] Embedded in-memory MongoDB running at: ${memUri}`);
        
        // Auto-seed demo fixtures into memory instance
        const seedScript = require('./scripts/seedRunner');
        await seedScript.runSeed();
      } catch (memErr) {
        console.error('[Database Engine Fatal] Failed to start embedded database:', memErr.message);
        throw dbErr;
      }
    }

    // 2. Active Transaction Probe
    await probeTransactionSupport();

    // 3. Ensure Default Category Settings
    await settingsService.getAllSettings();

    // 4. Start Outbox Background Queue
    outboxWorker.start();

    // 5. Mark DB ready and release waiting requests
    isDbReady = true;
    dbReadyResolve();
    console.log('[Database Engine] Operations Database is 100% READY.');
  } catch (error) {
    console.error('[Fatal Bootstrap Error]:', error);
  }
}

initDatabase();

// Graceful Shutdown Handlers
const handleShutdown = async (signal) => {
  console.log(`\n[Shutdown] Received ${signal}. Initiating graceful teardown...`);
  outboxWorker.stop();
  if (server) {
    server.close(async () => {
      console.log('[Shutdown] HTTP server closed.');
      await disconnectDB();
      if (memoryServer) {
        await memoryServer.stop();
      }
      process.exit(0);
    });
  } else {
    await disconnectDB();
    if (memoryServer) {
      await memoryServer.stop();
    }
    process.exit(0);
  }
};

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));
