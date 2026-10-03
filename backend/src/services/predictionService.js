const preprocessingService = require('./preprocessingService');
const modelService = require('./modelService');
const explanationService = require('./explanationService');
const studentRepo = require('../models/Student');

class PredictionService {
  async predictStudent(studentInput, modelName = null) {
    // 1. Preprocess & encode
    const { featureRow, vector, featureNames } = preprocessingService.processStudentInput(studentInput);

    // 2. Run model inference
    const modelResult = modelService.predict(vector, modelName);

    // 3. Generate XAI explanation
    const explanation = explanationService.generateExplanation(
      featureRow,
      vector,
      featureNames,
      modelResult.probability,
      modelResult.predictedClass
    );

    const predictionPayload = {
      modelUsed: modelResult.modelName,
      probability: modelResult.probability,
      percentage: `${(modelResult.probability * 100).toFixed(1)}%`,
      predictedClass: modelResult.predictedClass,
      label: modelResult.predictedClass === 1 ? 'Procrastination Pattern Detected' : 'No Significant Pattern Detected',
      riskTier: explanation.riskTier,
      riskLevel: explanation.riskTier,
      riskScore: parseFloat((modelResult.probability * 100).toFixed(1)),
      studentData: featureRow,
      explanation
    };

    // 4. Save to history
    const savedRecord = studentRepo.save({
      studentName: studentInput.student_name || 'Anonymous Student',
      ...predictionPayload
    });

    return {
      ...predictionPayload,
      recordId: savedRecord._id,
      timestamp: savedRecord.createdAt
    };
  }
}

module.exports = new PredictionService();
