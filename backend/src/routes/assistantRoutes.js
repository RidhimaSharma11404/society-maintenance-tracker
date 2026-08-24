const express = require('express');
const assistantController = require('../controllers/assistantController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authenticate);

router.post('/chat', (req, res, next) => assistantController.chat(req, res, next));

module.exports = router;
