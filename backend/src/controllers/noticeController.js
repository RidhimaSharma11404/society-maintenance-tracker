const noticeService = require('../services/noticeService');
const ApiResponse = require('../utils/apiResponse');

class NoticeController {
  async create(req, res, next) {
    try {
      const { title, content, isPinned, category } = req.body;

      if (!title || !content) {
        return ApiResponse.error(res, 'Title and content are required.', 400);
      }

      const notice = await noticeService.createNotice({
        title,
        content,
        isPinned,
        category,
        createdBy: req.user.id
      });

      return ApiResponse.created(res, notice, 'Notice published successfully.');
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const notices = await noticeService.getAllNotices();
      return ApiResponse.success(res, { notices }, 'Notices retrieved.');
    } catch (error) {
      next(error);
    }
  }

  async getPinned(req, res, next) {
    try {
      const notices = await noticeService.getPinnedNotices();
      return ApiResponse.success(res, { notices }, 'Pinned notices retrieved.');
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await noticeService.deleteNotice(req.params.id);
      return ApiResponse.success(res, null, 'Notice deleted successfully.');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new NoticeController();
