const express = require('express');
const settingsController = require('../controllers/settingsController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(authenticate);

router.get('/', (req, res, next) => settingsController.getAll(req, res, next));
router.put('/:category', authorize(['admin']), (req, res, next) => settingsController.update(req, res, next));

module.exports = router;
