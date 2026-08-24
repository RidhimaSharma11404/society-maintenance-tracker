const outboxDispatcherService = require('../services/outboxDispatcherService');
const ApiResponse = require('../utils/apiResponse');

class OutboxController {
  async getLogs(req, res, next) {
    try {
      const { status, limit } = req.query;
      const filter = {};
      if (status && status !== 'All') {
        filter.status = status;
      }

      const logs = await outboxDispatcherService.getLogs(filter, Number(limit) || 50);
      return ApiResponse.success(res, { logs }, 'Outbox records retrieved.');
    } catch (error) {
      next(error);
    }
  }

  async triggerProcess(req, res, next) {
    try {
      const result = await outboxDispatcherService.processPendingOutbox();
      return ApiResponse.success(res, result, 'Outbox queue processed.');
    } catch (error) {
      next(error);
    }
  }

  async retry(req, res, next) {
    try {
      const updated = await outboxDispatcherService.retryItem(req.params.id);
      return ApiResponse.success(res, updated, 'Outbox item queued for retry.');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new OutboxController();
