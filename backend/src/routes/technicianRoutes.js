const express = require('express');
const router = express.Router();
const technicianController = require('../controllers/technicianController');
const { authenticate } = require('../middleware/authMiddleware');

router.use(authenticate);

router.get('/', technicianController.getAllTechnicians);
router.post('/dispatch', technicianController.dispatchTechnician);

module.exports = router;
