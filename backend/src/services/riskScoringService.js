const complaintRepository = require('../repositories/complaintRepository');
const config = require('../config/env');

class RiskScoringService {
  /**
   * Retrieves high-risk clusters (unitNumber + category) dynamically
   * based on the 90-day exponential decay aggregation.
   */
  async getRecurringRiskClusters(windowDays = config.riskScoring.windowDays, threshold = config.riskScoring.thresholdScore) {
    return await complaintRepository.getRecurringRiskClusters(
      Number(windowDays) || 90,
      Number(threshold) || 3.0
    );
  }

  /**
   * Provides composite risk metrics for analytics charts
   */
  async getRiskAnalytics() {
    const clusters = await this.getRecurringRiskClusters(90, 1.0); // fetch with lower threshold for complete distribution
    
    // Group risk by category
    const categoryRiskMap = {};
    // Group risk by block/unit
    const unitRiskMap = {};

    clusters.forEach(c => {
      categoryRiskMap[c.category] = (categoryRiskMap[c.category] || 0) + c.totalRiskScore;
      unitRiskMap[c.unitNumber] = (unitRiskMap[c.unitNumber] || 0) + c.totalRiskScore;
    });

    const categoryRiskData = Object.entries(categoryRiskMap)
      .map(([category, score]) => ({ category, score: Number(score.toFixed(2)) }))
      .sort((a, b) => b.score - a.score);

    const unitRiskData = Object.entries(unitRiskMap)
      .map(([unitNumber, score]) => ({ unitNumber, score: Number(score.toFixed(2)) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    const criticalCount = clusters.filter(c => c.totalRiskScore >= 8.0).length;
    const highCount = clusters.filter(c => c.totalRiskScore >= 5.0 && c.totalRiskScore < 8.0).length;
    const elevatedCount = clusters.filter(c => c.totalRiskScore >= 3.0 && c.totalRiskScore < 5.0).length;

    return {
      clusters: clusters.filter(c => c.totalRiskScore >= config.riskScoring.thresholdScore),
      categoryRiskData,
      unitRiskData,
      summary: {
        totalClusters: clusters.filter(c => c.totalRiskScore >= config.riskScoring.thresholdScore).length,
        criticalCount,
        highCount,
        elevatedCount
      }
    };
  }
}

module.exports = new RiskScoringService();
