const express = require('express');
const noticeController = require('../controllers/noticeController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(authenticate);

router.get('/', (req, res, next) => noticeController.getAll(req, res, next));
router.get('/pinned', (req, res, next) => noticeController.getPinned(req, res, next));
router.post('/', authorize(['admin', 'staff']), (req, res, next) => noticeController.create(req, res, next));
router.delete('/:id', authorize(['admin']), (req, res, next) => noticeController.delete(req, res, next));

module.exports = router;
