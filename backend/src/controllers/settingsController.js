const settingsService = require('../services/settingsService');
const ApiResponse = require('../utils/apiResponse');

class SettingsController {
  async getAll(req, res, next) {
    try {
      const settings = await settingsService.getAllSettings();
      return ApiResponse.success(res, { settings }, 'Category settings retrieved.');
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { category } = req.params;
      const { severityWeight, slaHours, description } = req.body;

      const updated = await settingsService.updateCategorySetting(category, {
        severityWeight,
        slaHours,
        description
      });

      return ApiResponse.success(res, updated, 'Category setting updated successfully.');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SettingsController();
