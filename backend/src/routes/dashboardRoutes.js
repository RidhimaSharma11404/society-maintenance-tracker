const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticate);

router.get('/summary', (req, res, next) => dashboardController.getSummary(req, res, next));

module.exports = router;
