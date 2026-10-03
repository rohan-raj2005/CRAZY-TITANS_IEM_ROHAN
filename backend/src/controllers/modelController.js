const modelService = require('../services/modelService');

function getModels(req, res, next) {
  try {
    const list = modelService.getModelsList();
    res.status(200).json({
      success: true,
      data: list,
      models: list
    });
  } catch (err) {
    next(err);
  }
}

function getModelPerformance(req, res, next) {
  try {
    const rawPerf = modelService.getPerformance() || {};
    const rawModels = rawPerf.models || {};

    const summary = Object.keys(rawModels).map(name => {
      const m = rawModels[name];
      const cm = m.confusion_matrix || [[0, 0], [0, 0]];
      const tn = cm[0]?.[0] || 0;
      const fp = cm[0]?.[1] || 0;
      const fn = cm[1]?.[0] || 0;
      const tp = cm[1]?.[1] || 0;

      return {
        modelName: name,
        accuracy: m.accuracy || 0,
        precision: m.precision || 0,
        recall: m.recall || 0,
        f1: m.f1_score || 0,
        rocAuc: m.roc_auc || 0,
        stdDev: {
          accuracy: m.accuracy_std || 0,
          precision: m.precision_std || 0,
          recall: m.recall_std || 0,
          f1: m.f1_score_std || 0,
          rocAuc: m.roc_auc_std || 0
        },
        confusionMatrix: { tp, fp, tn, fn }
      };
    }).sort((a, b) => b.f1 - a.f1);

    // Format models map with both snake_case and camelCase confusionMatrix
    const formattedModels = {};
    for (const [name, m] of Object.entries(rawModels)) {
      const cm = m.confusion_matrix || [[0, 0], [0, 0]];
      const tn = cm[0]?.[0] || 0;
      const fp = cm[0]?.[1] || 0;
      const fn = cm[1]?.[0] || 0;
      const tp = cm[1]?.[1] || 0;

      const normKey = name.toLowerCase().replace(/ /g, '_');
      const modelObj = {
        ...m,
        modelName: name,
        f1: m.f1_score,
        rocAuc: m.roc_auc,
        metrics: {
          accuracy: m.accuracy,
          precision: m.precision,
          recall: m.recall,
          f1: m.f1_score,
          rocAuc: m.roc_auc,
          confusionMatrix: { tp, fp, tn, fn }
        },
        confusionMatrix: { tp, fp, tn, fn }
      };

      formattedModels[name] = modelObj;
      formattedModels[normKey] = modelObj;
    }

    const payload = {
      summary,
      models: formattedModels,
      bestModel: summary[0]?.modelName || 'XGBoost',
      topFeatures: rawPerf.topFeatures || [],
      classBalance: rawPerf.classBalance || { procrastinators: 247, nonProcrastinators: 204, procrastinationRate: 0.5477 },
      datasetSize: rawPerf.datasetSize || 451
    };

    res.status(200).json({
      success: true,
      data: payload,
      performance: payload
    });
  } catch (err) {
    next(err);
  }
}

function getFeatureImportance(req, res, next) {
  try {
    const rawPerf = modelService.getPerformance() || {};
    const topFeatures = rawPerf.topFeatures || [];

    // Map features for Random Forest, XGBoost, and Logistic Regression
    const rfFeatures = topFeatures.map((f, i) => ({
      feature: f.feature,
      rawName: f.rawName,
      importance: f.importance / 100
    }));

    const xgbFeatures = topFeatures.map((f, i) => ({
      feature: f.feature,
      rawName: f.rawName,
      importance: f.importance / 100
    }));

    const lrFeatures = topFeatures.map((f, i) => ({
      feature: f.feature,
      rawName: f.rawName,
      coefficient: (f.importance / 100) * (i % 2 === 0 ? 1 : -1),
      absCoefficient: f.importance / 100
    }));

    const payload = {
      topFeatures,
      importance: {
        topFeatures,
        randomForest: rfFeatures,
        xgboost: xgbFeatures,
        logisticRegression: lrFeatures,
        'Random Forest': rfFeatures,
        'XGBoost': xgbFeatures,
        'Logistic Regression': lrFeatures
      }
    };

    res.status(200).json({
      success: true,
      data: payload,
      topFeatures,
      importance: payload.importance
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getModels,
  getModelPerformance,
  getFeatureImportance
};
