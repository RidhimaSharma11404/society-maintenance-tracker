const complaintRepository = require('../repositories/complaintRepository');
const userRepository = require('../repositories/userRepository');
const outboxRepository = require('../repositories/outboxRepository');
const settingsService = require('./settingsService');
const uploadService = require('./uploadService');
const { calculateDueDate } = require('../utils/mathUtils');
const { runInTransaction } = require('../utils/transactionManager');

class ComplaintService {
  /**
   * Raises a new complaint with SLA due date calculation, photo upload,
   * initial status history, and transactional outbox event creation.
   */
  async createComplaint({ title, description, category, unitNumber, residentId, photoFile, priority }) {
    const resident = await userRepository.findById(residentId);
    if (!resident) {
      const error = new Error('Resident not found.');
      error.statusCode = 404;
      throw error;
    }

    // Get category SLA setting
    const categorySetting = await settingsService.getCategorySetting(category);
    const slaHours = categorySetting.slaHours || 24;
    const dueDate = calculateDueDate(new Date(), slaHours);

    // Hybrid photo upload
    let photoUrl = null;
    if (photoFile) {
      photoUrl = await uploadService.uploadFile(photoFile);
    }

    const resolvedUnit = unitNumber || resident.unitNumber;

    const initialHistory = [
      {
        status: 'Open',
        updatedBy: resident._id,
        updatedAt: new Date(),
        comment: 'Complaint ticket created by resident.'
      }
    ];

    return await runInTransaction(async (session) => {
      // 1. Create complaint document
      const complaint = await complaintRepository.create(
        {
          title,
          description,
          category,
          unitNumber: resolvedUnit,
          resident: resident._id,
          photoUrl,
          currentStatus: 'Open',
          statusHistory: initialHistory,
          dueDate,
          priority: priority || 'Medium'
        },
        session
      );

      // 2. Insert Transactional Outbox Event
      await outboxRepository.create(
        {
          recipient: resident.email,
          subject: `[Society Ops] Ticket Registered: #${complaint._id.toString().slice(-6).toUpperCase()} - ${title}`,
          body: `Dear ${resident.name},\n\nYour maintenance complaint for ${category} (${resolvedUnit}) has been registered.\nEstimated resolution target (SLA): ${dueDate.toLocaleString()}.\n\nDescription: ${description}`,
          status: 'PENDING',
          metadata: {
            complaintId: complaint._id,
            eventType: 'COMPLAINT_CREATED',
            category,
            unitNumber: resolvedUnit
          }
        },
        session
      );

      return complaint;
    });
  }

  /**
   * Transitions complaint lifecycle status with comment audit and transactional outbox event.
   */
  async updateStatus(complaintId, { nextStatus, comment, actorUser }) {
    if (!nextStatus || !comment) {
      const error = new Error('Both next status and transition comment are required.');
      error.statusCode = 400;
      throw error;
    }

    const complaint = await complaintRepository.findById(complaintId);
    if (!complaint) {
      const error = new Error('Complaint not found.');
      error.statusCode = 404;
      throw error;
    }

    const prevStatus = complaint.currentStatus;
    if (prevStatus === nextStatus) {
      const error = new Error(`Complaint is already in '${nextStatus}' status.`);
      error.statusCode = 400;
      throw error;
    }

    // Append to status history
    complaint.statusHistory.push({
      status: nextStatus,
      updatedBy: actorUser.id,
      updatedAt: new Date(),
      comment
    });

    complaint.currentStatus = nextStatus;

    return await runInTransaction(async (session) => {
      // Save complaint (FSM pre-save hook enforces allowed transitions)
      const updated = await complaintRepository.save(complaint, session);

      // Populate resident email
      const resident = await userRepository.findById(complaint.resident);
      const recipientEmail = resident ? resident.email : 'resident@society.internal';

      // Insert Transactional Outbox Event
      await outboxRepository.create(
        {
          recipient: recipientEmail,
          subject: `[Society Ops] Status Update: #${complaint._id.toString().slice(-6).toUpperCase()} is now ${nextStatus}`,
          body: `Hello,\n\nThe status of complaint "${complaint.title}" (Unit: ${complaint.unitNumber}) was updated from "${prevStatus}" to "${nextStatus}".\n\nNotes from ${actorUser.name || 'Ops Team'} (${actorUser.role || 'Staff'}):\n"${comment}"\n\nUpdated at: ${new Date().toLocaleString()}`,
          status: 'PENDING',
          metadata: {
            complaintId: complaint._id,
            eventType: 'STATUS_CHANGED',
            prevStatus,
            nextStatus,
            updatedBy: actorUser.id
          }
        },
        session
      );

      return updated;
    });
  }

  /**
   * Query complaints with filtering and computed SLA indicators
   */
  async getComplaints({ status, category, unitNumber, residentId, search, isOverdue, page = 1, limit = 50 }) {
    const filter = {};

    if (status && status !== 'All') {
      filter.currentStatus = status;
    }
    if (category && category !== 'All') {
      filter.category = category;
    }
    if (unitNumber) {
      filter.unitNumber = { $regex: unitNumber, $options: 'i' };
    }
    if (residentId) {
      filter.resident = residentId;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { unitNumber: { $regex: search, $options: 'i' } }
      ];
    }
    if (isOverdue === 'true') {
      filter.dueDate = { $lt: new Date() };
      filter.currentStatus = { $in: ['Open', 'In Progress'] };
    }

    const skip = (Math.max(1, Number(page)) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      complaintRepository.find(filter, { createdAt: -1 }, Number(limit), skip),
      complaintRepository.count(filter)
    ]);

    const now = new Date().getTime();
    const enrichedItems = items.map((item) => {
      const doc = item.toObject();
      const dueTime = new Date(doc.dueDate).getTime();
      const isPastDue = now > dueTime && ['Open', 'In Progress'].includes(doc.currentStatus);
      const remainingMs = dueTime - now;
      const remainingHours = Math.round(remainingMs / (1000 * 60 * 60));

      return {
        ...doc,
        isOverdue: isPastDue,
        remainingHours: isPastDue ? 0 : Math.max(0, remainingHours)
      };
    });

    return {
      items: enrichedItems,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    };
  }

  async getComplaintById(id) {
    const complaint = await complaintRepository.findById(id);
    if (!complaint) {
      const error = new Error('Complaint not found.');
      error.statusCode = 404;
      throw error;
    }
    const doc = complaint.toObject();
    const now = new Date().getTime();
    const dueTime = new Date(doc.dueDate).getTime();
    const isPastDue = now > dueTime && ['Open', 'In Progress'].includes(doc.currentStatus);
    const remainingHours = Math.round((dueTime - now) / (1000 * 60 * 60));

    return {
      ...doc,
      isOverdue: isPastDue,
      remainingHours: isPastDue ? 0 : Math.max(0, remainingHours)
    };
  }
}

module.exports = new ComplaintService();
