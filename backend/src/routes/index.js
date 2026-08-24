const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const complaintRoutes = require('./complaintRoutes');
const noticeRoutes = require('./noticeRoutes');
const settingsRoutes = require('./settingsRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const outboxRoutes = require('./outboxRoutes');
const assistantRoutes = require('./assistantRoutes');
const billingRoutes = require('./billingRoutes');
const technicianRoutes = require('./technicianRoutes');

router.use('/auth', authRoutes);
router.use('/complaints', complaintRoutes);
router.use('/notices', noticeRoutes);
router.use('/settings', settingsRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/outbox', outboxRoutes);
router.use('/assistant', assistantRoutes);
router.use('/billing', billingRoutes);
router.use('/technicians', technicianRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    status: 'UP',
    timestamp: new Date(),
    service: 'Society Maintenance Tracker API'
  });
});

module.exports = router;
