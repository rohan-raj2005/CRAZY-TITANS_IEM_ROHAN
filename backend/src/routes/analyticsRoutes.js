const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// GET /api/analytics and aliases
router.get('/analytics', analyticsController.getAnalytics);
router.get('/analytics/overview', analyticsController.getAnalytics);
router.get('/analytics/summary', analyticsController.getAnalytics);

module.exports = router;
