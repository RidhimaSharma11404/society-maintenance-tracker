const complaintService = require('../services/complaintService');
const riskScoringService = require('../services/riskScoringService');
const ApiResponse = require('../utils/apiResponse');

class ComplaintController {
  async create(req, res, next) {
    try {
      const { title, description, category, unitNumber, priority } = req.body;

      if (!title || !description || !category) {
        return ApiResponse.error(res, 'Title, description, and category are required.', 400);
      }

      const complaint = await complaintService.createComplaint({
        title,
        description,
        category,
        unitNumber: unitNumber || req.user.unitNumber,
        residentId: req.user.id,
        photoFile: req.file || null,
        priority: priority || 'Medium'
      });

      return ApiResponse.created(res, complaint, 'Complaint submitted successfully.');
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const { status, category, unitNumber, search, isOverdue, page, limit, myOnly } = req.query;

      // If resident and myOnly=true or resident wants their complaints
      let residentId = null;
      if (req.user.role === 'resident' && (myOnly === 'true' || req.query.residentOnly === 'true')) {
        residentId = req.user.id;
      }

      const result = await complaintService.getComplaints({
        status,
        category,
        unitNumber,
        residentId,
        search,
        isOverdue,
        page,
        limit
      });

      return ApiResponse.success(res, result, 'Complaints retrieved successfully.');
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const complaint = await complaintService.getComplaintById(req.params.id);
      return ApiResponse.success(res, complaint, 'Complaint details retrieved.');
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const { nextStatus, comment } = req.body;

      if (!nextStatus || !comment) {
        return ApiResponse.error(res, 'nextStatus and comment are required.', 400);
      }

      const updated = await complaintService.updateStatus(req.params.id, {
        nextStatus,
        comment,
        actorUser: req.user
      });

      return ApiResponse.success(res, updated, `Status transitioned to '${nextStatus}' successfully.`);
    } catch (error) {
      next(error);
    }
  }

  async getRecurringRisk(req, res, next) {
    try {
      const { windowDays, threshold } = req.query;
      const clusters = await riskScoringService.getRecurringRiskClusters(windowDays, threshold);
      return ApiResponse.success(res, { clusters }, 'Recurring risk clusters calculated successfully.');
    } catch (error) {
      next(error);
    }
  }

  async getRiskAnalytics(req, res, next) {
    try {
      const analytics = await riskScoringService.getRiskAnalytics();
      return ApiResponse.success(res, analytics, 'Risk analytics aggregated successfully.');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ComplaintController();
