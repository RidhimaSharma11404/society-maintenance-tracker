const NotificationOutbox = require('../models/NotificationOutbox');

class OutboxRepository {
  async create(recordData, session = null) {
    const record = new NotificationOutbox(recordData);
    return await record.save({ session });
  }

  async findPending(limit = 10) {
    return await NotificationOutbox.find({
      status: { $in: ['PENDING', 'FAILED'] },
      attempts: { $lt: 5 }
    })
      .sort({ createdAt: 1 })
      .limit(limit);
  }

  async updateStatus(id, updateData) {
    return await NotificationOutbox.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );
  }

  async findAll(filter = {}, sort = { createdAt: -1 }, limit = 50) {
    return await NotificationOutbox.find(filter).sort(sort).limit(limit);
  }

  async count(filter = {}) {
    return await NotificationOutbox.countDocuments(filter);
  }
}

module.exports = new OutboxRepository();
