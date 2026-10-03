const express = require('express');
const router = express.Router();
const modelController = require('../controllers/modelController');

// GET /api/models -> List all supported models and active model
router.get('/models', modelController.getModels);
router.get('/models/list', modelController.getModels);

// GET /api/models/performance -> 5-fold CV evaluation metrics, confusion matrix, ROC
router.get('/models/performance', modelController.getModelPerformance);
router.get('/models/comparison', modelController.getModelPerformance);
router.get('/models/benchmarks', modelController.getModelPerformance);

// GET /api/features/importance -> Feature importance ranks
router.get('/features/importance', modelController.getFeatureImportance);
router.get('/features', modelController.getFeatureImportance);

module.exports = router;
