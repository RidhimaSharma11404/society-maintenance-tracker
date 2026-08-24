const express = require('express');
const complaintController = require('../controllers/complaintController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// All complaint endpoints require authentication
router.use(authenticate);

// Dynamic Risk Analytics Endpoints
router.get('/recurring-risk', (req, res, next) => complaintController.getRecurringRisk(req, res, next));
router.get('/risk-analytics', (req, res, next) => complaintController.getRiskAnalytics(req, res, next));

// Standard CRUD & Lifecycle endpoints
router.post('/', upload.single('photo'), (req, res, next) => complaintController.create(req, res, next));
router.get('/', (req, res, next) => complaintController.getAll(req, res, next));
router.get('/:id', (req, res, next) => complaintController.getById(req, res, next));

// Status lifecycle update (Admins and Staff can transition any ticket; Residents can update their own if needed)
router.put('/:id/status', (req, res, next) => complaintController.updateStatus(req, res, next));

module.exports = router;
