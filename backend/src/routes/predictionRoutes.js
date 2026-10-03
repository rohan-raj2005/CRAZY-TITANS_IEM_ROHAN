const express = require('express');
const router = express.Router();
const predictionController = require('../controllers/predictionController');
const { validateStudentInput } = require('../middleware/validation');

// POST /api/prediction and /api/predict -> Run student prediction
router.post('/prediction', validateStudentInput, predictionController.handlePredict);
router.post('/predict', validateStudentInput, predictionController.handlePredict);

// GET /api/students and /api/history -> Fetch prediction history
router.get('/students', predictionController.getStudentHistory);
router.get('/history', predictionController.getStudentHistory);

// GET /api/students/:id -> Fetch single student prediction detail
router.get('/students/:id', predictionController.getStudentById);

module.exports = router;
