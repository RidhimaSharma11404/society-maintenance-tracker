const outboxRepository = require('../repositories/outboxRepository');
const config = require('../config/env');

class OutboxDispatcherService {
  /**
   * Processes a batch of pending outbox messages
   */
  async processPendingOutbox() {
    try {
      const pendingItems = await outboxRepository.findPending(10);
      if (!pendingItems || pendingItems.length === 0) {
        return { processed: 0 };
      }

      let successCount = 0;
      let failureCount = 0;

      for (const item of pendingItems) {
        const attempt = (item.attempts || 0) + 1;
        const now = new Date();

        try {
          // Simulate / dispatch notification
          await this.deliverNotification(item);

          await outboxRepository.updateStatus(item._id, {
            status: 'SENT',
            attempts: attempt,
            lastAttempt: now,
            error: null
          });
          successCount++;
        } catch (err) {
          const isFinalFailure = attempt >= config.outbox.maxAttempts;
          await outboxRepository.updateStatus(item._id, {
            status: isFinalFailure ? 'FAILED' : 'PENDING',
            attempts: attempt,
            lastAttempt: now,
            error: err.message || 'Notification dispatch failed'
          });
          failureCount++;
        }
      }

      return {
        processed: pendingItems.length,
        successCount,
        failureCount
      };
    } catch (err) {
      console.error('[Outbox Dispatcher Error]:', err.message);
      return { error: err.message };
    }
  }

  /**
   * Dispatches the actual notification.
   * In enterprise production, connects to SMTP/SendGrid/SES/Twilio.
   */
  async deliverNotification(outboxItem) {
    // Artificial slight delay to simulate network latency if needed
    // In production, this executes async delivery
    console.log(
      `[Outbox Dispatcher] >> Dispatched notification to [${outboxItem.recipient}] | Subject: "${outboxItem.subject}"`
    );
    return true;
  }

  /**
   * Get all outbox logs with filtering
   */
  async getLogs(filter = {}, limit = 50) {
    return await outboxRepository.findAll(filter, { createdAt: -1 }, limit);
  }

  /**
   * Retry failed or pending items
   */
  async retryItem(id) {
    return await outboxRepository.updateStatus(id, {
      status: 'PENDING',
      attempts: 0,
      error: null
    });
  }
}

module.exports = new OutboxDispatcherService();
