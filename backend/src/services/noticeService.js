const noticeRepository = require('../repositories/noticeRepository');

class NoticeService {
  async createNotice({ title, content, isPinned, category, createdBy }) {
    return await noticeRepository.create({
      title,
      content,
      isPinned: !!isPinned,
      category: category || 'General',
      createdBy
    });
  }

  async getAllNotices(limit = 50) {
    return await noticeRepository.find({}, { isPinned: -1, createdAt: -1 }, limit);
  }

  async getPinnedNotices() {
    return await noticeRepository.find({ isPinned: true }, { createdAt: -1 }, 10);
  }

  async deleteNotice(id) {
    const deleted = await noticeRepository.deleteById(id);
    if (!deleted) {
      const error = new Error('Notice not found.');
      error.statusCode = 404;
      throw error;
    }
    return deleted;
  }
}

module.exports = new NoticeService();
