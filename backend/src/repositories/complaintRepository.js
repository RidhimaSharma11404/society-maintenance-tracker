const Complaint = require('../models/Complaint');
const config = require('../config/env');

class ComplaintRepository {
  async create(complaintData, session = null) {
    const complaint = new Complaint(complaintData);
    return await complaint.save({ session });
  }

  async findById(id) {
    return await Complaint.findById(id)
      .populate('resident', 'name email unitNumber phoneNumber')
      .populate('statusHistory.updatedBy', 'name email role');
  }

  async find(filter = {}, sort = { createdAt: -1 }, limit = 100, skip = 0) {
    return await Complaint.find(filter)
      .populate('resident', 'name email unitNumber phoneNumber')
      .populate('statusHistory.updatedBy', 'name email role')
      .sort(sort)
      .skip(skip)
      .limit(limit);
  }

  async count(filter = {}) {
    return await Complaint.countDocuments(filter);
  }

  async save(complaintInstance, session = null) {
    return await complaintInstance.save({ session });
  }

  /**
   * Aggregation Pipeline for Dynamic Risk Scoring
   * Performs dynamic decay calculation and joins CategorySettings with fallback.
   */
  async getRecurringRiskClusters(windowDays = 90, threshold = 3.0) {
    const windowStart = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000);
    const lambda = config.riskScoring.decayConstant; // 0.0231

    return await Complaint.aggregate([
      {
        $match: {
          createdAt: { $gte: windowStart }
        }
      },
      {
        $lookup: {
          from: 'categorysettings',
          localField: 'category',
          foreignField: 'category',
          as: 'settings'
        }
      },
      {
        $unwind: {
          path: '$settings',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          unitNumber: 1,
          category: 1,
          createdAt: 1,
          currentStatus: 1,
          severityWeight: { $ifNull: ['$settings.severityWeight', config.riskScoring.defaultSeverityWeight] },
          daysAgo: {
            $divide: [
              { $subtract: [new Date(), '$createdAt'] },
              1000 * 60 * 60 * 24
            ]
          }
        }
      },
      {
        $project: {
          unitNumber: 1,
          category: 1,
          createdAt: 1,
          currentStatus: 1,
          severityWeight: 1,
          daysAgo: 1,
          decayedScore: {
            $multiply: [
              '$severityWeight',
              { $exp: { $multiply: [-lambda, '$daysAgo'] } }
            ]
          }
        }
      },
      {
        $group: {
          _id: {
            unitNumber: '$unitNumber',
            category: '$category'
          },
          totalRiskScore: { $sum: '$decayedScore' },
          complaintCount: { $sum: 1 },
          lastComplaintDate: { $max: '$createdAt' },
          activeComplaintsCount: {
            $sum: {
              $cond: [
                { $in: ['$currentStatus', ['Open', 'In Progress']] },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $match: {
          totalRiskScore: { $gte: threshold }
        }
      },
      {
        $project: {
          _id: 0,
          unitNumber: '$_id.unitNumber',
          category: '$_id.category',
          totalRiskScore: { $round: ['$totalRiskScore', 2] },
          complaintCount: 1,
          activeComplaintsCount: 1,
          lastComplaintDate: 1,
          riskLevel: {
            $switch: {
              branches: [
                { case: { $gte: ['$totalRiskScore', 8.0] }, then: 'Critical' },
                { case: { $gte: ['$totalRiskScore', 5.0] }, then: 'High' },
                { case: { $gte: ['$totalRiskScore', 3.0] }, then: 'Elevated' }
              ],
              default: 'Moderate'
            }
          }
        }
      },
      {
        $sort: { totalRiskScore: -1 }
      }
    ]);
  }

  /**
   * Aggregates stats for dashboard summary:
   * - status breakdown
   * - category breakdown
   * - overdue counts
   */
  async getDashboardSummary() {
    const now = new Date();

    const [statusStats, categoryStats, overdueStats] = await Promise.all([
      Complaint.aggregate([
        {
          $group: {
            _id: '$currentStatus',
            count: { $sum: 1 }
          }
        }
      ]),
      Complaint.aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]),
      Complaint.countDocuments({
        dueDate: { $lt: now },
        currentStatus: { $in: ['Open', 'In Progress'] }
      })
    ]);

    return {
      statusStats,
      categoryStats,
      overdueCount: overdueStats
    };
  }
}

module.exports = new ComplaintRepository();
