const outboxDispatcherService = require('../services/outboxDispatcherService');
const config = require('../config/env');

class OutboxWorker {
  constructor() {
    this.timer = null;
    this.isProcessing = false;
  }

  start() {
    if (this.timer) {
      return;
    }
    console.log(`[Outbox Worker] Background event dispatcher initialized (Poll Interval: ${config.outbox.pollIntervalMs}ms).`);
    
    // Initial run after slight startup delay
    setTimeout(() => this.tick(), 2000);

    this.timer = setInterval(() => {
      this.tick();
    }, config.outbox.pollIntervalMs);
  }

  async tick() {
    if (this.isProcessing) {
      return;
    }
    this.isProcessing = true;
    try {
      await outboxDispatcherService.processPendingOutbox();
    } catch (err) {
      console.error('[Outbox Worker Tick Error]:', err.message);
    } finally {
      this.isProcessing = false;
    }
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      console.log('[Outbox Worker] Background event dispatcher stopped.');
    }
  }
}

module.exports = new OutboxWorker();
