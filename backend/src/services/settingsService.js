const categorySettingRepository = require('../repositories/categorySettingRepository');

const DEFAULT_CATEGORY_SETTINGS = [
  { category: 'Plumbing', severityWeight: 4, slaHours: 24, description: 'Water leakage, pipe burst, drainage clogging' },
  { category: 'Electrical', severityWeight: 4, slaHours: 12, description: 'Power failure, short circuit, generator backup' },
  { category: 'Security', severityWeight: 5, slaHours: 4, description: 'Gate boom-barrier, CCTV outage, guard issues' },
  { category: 'Elevator / Lift', severityWeight: 5, slaHours: 6, description: 'Lift breakdown, emergency alarm, stuck car' },
  { category: 'Housekeeping / Sanitation', severityWeight: 2, slaHours: 48, description: 'Corridor cleaning, garbage disposal, pest control' },
  { category: 'Gardening & Landscape', severityWeight: 2, slaHours: 72, description: 'Lawn mowing, tree trimming, irrigation' },
  { category: 'Carpentry / Civil', severityWeight: 3, slaHours: 48, description: 'Door repair, wall plaster, paint damage' },
  { category: 'HVAC / Common Area', severityWeight: 3, slaHours: 24, description: 'Clubhouse AC, gym ventilation, pool pump' }
];

class SettingsService {
  async getAllSettings() {
    let settings = await categorySettingRepository.findAll();
    if (!settings || settings.length === 0) {
      await this.seedDefaultSettings();
      settings = await categorySettingRepository.findAll();
    }
    return settings;
  }

  async getCategorySetting(category) {
    const setting = await categorySettingRepository.findByCategory(category);
    if (!setting) {
      // Return default fallback
      return {
        category,
        severityWeight: 3,
        slaHours: 24
      };
    }
    return setting;
  }

  async updateCategorySetting(category, { severityWeight, slaHours, description }) {
    if (severityWeight !== undefined && (severityWeight < 1 || severityWeight > 5)) {
      const error = new Error('Severity weight must be an integer between 1 and 5.');
      error.statusCode = 400;
      throw error;
    }
    if (slaHours !== undefined && slaHours < 1) {
      const error = new Error('SLA hours must be at least 1 hour.');
      error.statusCode = 400;
      throw error;
    }

    return await categorySettingRepository.upsert(category, {
      severityWeight,
      slaHours,
      description
    });
  }

  async seedDefaultSettings() {
    for (const item of DEFAULT_CATEGORY_SETTINGS) {
      await categorySettingRepository.upsert(item.category, item);
    }
  }
}

module.exports = new SettingsService();
