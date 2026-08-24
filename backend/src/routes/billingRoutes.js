const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billingController');
const { authenticate } = require('../middleware/authMiddleware');

router.use(authenticate);

router.get('/', billingController.getAllInvoices);
router.post('/:id/pay', billingController.payInvoice);

module.exports = router;
