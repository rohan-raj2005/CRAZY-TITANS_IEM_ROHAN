const fs = require('fs');
const path = require('path');
const config = require('../config/config');
const {
  LogisticRegressionModel,
  RandomForestModel,
  XGBoostModel
} = require('../../ml/trainModels');

class ModelService {
  constructor() {
    this.models = {};
    this.performance = null;
    this.bestModelName = 'Random Forest';
    this.loadModels();
  }

  loadModels() {
    try {
      const lrPath = path.join(config.TRAINED_MODELS_DIR, 'logistic_regression.json');
      const rfPath = path.join(config.TRAINED_MODELS_DIR, 'random_forest.json');
      const xgbPath = path.join(config.TRAINED_MODELS_DIR, 'xgboost.json');
      const perfPath = path.join(config.EVALUATION_DIR, 'model_performance.json');

      if (fs.existsSync(lrPath)) {
        this.models['Logistic Regression'] = LogisticRegressionModel.fromJSON(JSON.parse(fs.readFileSync(lrPath, 'utf8')));
      }
      if (fs.existsSync(rfPath)) {
        this.models['Random Forest'] = RandomForestModel.fromJSON(JSON.parse(fs.readFileSync(rfPath, 'utf8')));
      }
      if (fs.existsSync(xgbPath)) {
        this.models['XGBoost'] = XGBoostModel.fromJSON(JSON.parse(fs.readFileSync(xgbPath, 'utf8')));
      }
      if (fs.existsSync(perfPath)) {
        this.performance = JSON.parse(fs.readFileSync(perfPath, 'utf8'));
      }

      console.log(`[ModelService] Loaded models: ${Object.keys(this.models).join(', ')}`);
    } catch (err) {
      console.error('[ModelService] Error loading models:', err);
    }
  }

  getPerformance() {
    if (!this.performance) {
      this.loadModels();
    }
    return this.performance;
  }

  getModelsList() {
    return Object.keys(this.models).map(name => ({
      name,
      type: name === 'Logistic Regression' ? 'Linear' : 'Tree Ensemble',
      isDefault: name === this.bestModelName,
      metrics: this.performance?.models?.[name] || null
    }));
  }

  predict(vector, modelName = null) {
    const targetModel = modelName && this.models[modelName] ? modelName : this.bestModelName;
    const model = this.models[targetModel];

    if (!model) {
      throw new Error(`Model '${targetModel}' is not loaded.`);
    }

    const prob = model.predictProba(vector);
    const predClass = prob >= 0.5 ? 1 : 0;

    return {
      modelName: targetModel,
      probability: parseFloat(prob.toFixed(4)),
      predictedClass: predClass
    };
  }
}

module.exports = new ModelService();
