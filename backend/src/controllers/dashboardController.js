const dashboardService = require('../services/dashboardService');
const ApiResponse = require('../utils/apiResponse');

class DashboardController {
  async getSummary(req, res, next) {
    try {
      const summary = await dashboardService.getSummaryMetrics();
      return ApiResponse.success(res, summary, 'Dashboard summary retrieved successfully.');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DashboardController();
