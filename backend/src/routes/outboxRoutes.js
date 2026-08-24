const express = require('express');
const outboxController = require('../controllers/outboxController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(authenticate);
router.use(authorize(['admin', 'staff']));

router.get('/logs', (req, res, next) => outboxController.getLogs(req, res, next));
router.post('/process', (req, res, next) => outboxController.triggerProcess(req, res, next));
router.post('/retry/:id', (req, res, next) => outboxController.retry(req, res, next));

module.exports = router;
