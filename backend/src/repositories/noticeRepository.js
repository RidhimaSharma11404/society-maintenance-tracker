const Notice = require('../models/Notice');

class NoticeRepository {
  async create(noticeData, session = null) {
    const notice = new Notice(noticeData);
    return await notice.save({ session });
  }

  async find(filter = {}, sort = { isPinned: -1, createdAt: -1 }, limit = 50) {
    return await Notice.find(filter)
      .populate('createdBy', 'name role')
      .sort(sort)
      .limit(limit);
  }

  async findById(id) {
    return await Notice.findById(id).populate('createdBy', 'name role');
  }

  async deleteById(id) {
    return await Notice.findByIdAndDelete(id);
  }

  async count(filter = {}) {
    return await Notice.countDocuments(filter);
  }
}

module.exports = new NoticeRepository();
