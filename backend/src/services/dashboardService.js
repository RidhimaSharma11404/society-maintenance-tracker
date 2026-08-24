const complaintRepository = require('../repositories/complaintRepository');
const userRepository = require('../repositories/userRepository');
const noticeRepository = require('../repositories/noticeRepository');
const outboxRepository = require('../repositories/outboxRepository');
const riskScoringService = require('./riskScoringService');

class DashboardService {
  async getSummaryMetrics() {
    const [complaintStats, totalUsers, totalResidents, pinnedNotices, outboxPendingCount, riskData, recentComplaints] =
      await Promise.all([
        complaintRepository.getDashboardSummary(),
        userRepository.count(),
        userRepository.count({ role: 'resident' }),
        noticeRepository.find({}, { createdAt: -1 }, 5),
        outboxRepository.count({ status: 'PENDING' }),
        riskScoringService.getRiskAnalytics(),
        complaintRepository.find({}, { createdAt: -1 }, 10, 0)
      ]);

    // Parse status breakdown into direct numbers
    const statusMap = {
      Open: 0,
      'In Progress': 0,
      Resolved: 0,
      Closed: 0
    };

    let totalComplaints = 0;
    complaintStats.statusStats.forEach((s) => {
      if (statusMap[s._id] !== undefined) {
        statusMap[s._id] = s.count;
      }
      totalComplaints += s.count;
    });

    const activeComplaints = statusMap.Open + statusMap['In Progress'];
    const resolutionRate = totalComplaints > 0 
      ? Math.round(((statusMap.Resolved + statusMap.Closed) / totalComplaints) * 100) 
      : 100;

    return {
      kpi: {
        totalComplaints,
        activeComplaints,
        openComplaints: statusMap.Open,
        inProgressComplaints: statusMap['In Progress'],
        resolvedComplaints: statusMap.Resolved,
        closedComplaints: statusMap.Closed,
        overdueComplaints: complaintStats.overdueCount,
        resolutionRate,
        highRiskClustersCount: riskData.summary.totalClusters,
        criticalRiskCount: riskData.summary.criticalCount,
        totalResidents,
        outboxPendingCount
      },
      categoryDistribution: complaintStats.categoryStats.map((c) => ({
        name: c._id || 'Unassigned',
        value: c.count
      })),
      riskAnalytics: {
        clusters: riskData.clusters || [],
        categoryRisk: riskData.categoryRiskData || [],
        unitRisk: riskData.unitRiskData || []
      },
      pinnedNotices: pinnedNotices || [],
      recentComplaints: recentComplaints || []
    };
  }
}

module.exports = new DashboardService();
