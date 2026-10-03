const fs = require('fs');
const path = require('path');
const { parseDataset, DatasetEncoder } = require('./preprocessing/preprocessor');

// ==========================================
// 1. LOGISTIC REGRESSION MODEL
// ==========================================
class LogisticRegressionModel {
  constructor(learningRate = 0.05, l2Lambda = 0.01, epochs = 200) {
    this.lr = learningRate;
    this.l2 = l2Lambda;
    this.epochs = epochs;
    this.weights = [];
    this.bias = 0;
  }

  sigmoid(z) {
    return 1 / (1 + Math.exp(-Math.max(-25, Math.min(25, z))));
  }

  fit(X, y) {
    const numSamples = X.length;
    const numFeatures = X[0].length;
    this.weights = new Array(numFeatures).fill(0);
    this.bias = 0;

    for (let epoch = 0; epoch < this.epochs; epoch++) {
      for (let i = 0; i < numSamples; i++) {
        const xi = X[i];
        const yi = y[i];
        let linearSum = this.bias;
        for (let j = 0; j < numFeatures; j++) {
          linearSum += this.weights[j] * xi[j];
        }
        const pred = this.sigmoid(linearSum);
        const error = pred - yi;

        for (let j = 0; j < numFeatures; j++) {
          this.weights[j] -= this.lr * (error * xi[j] + this.l2 * this.weights[j]);
        }
        this.bias -= this.lr * error;
      }
    }
  }

  predictProba(x) {
    let linearSum = this.bias;
    for (let j = 0; j < this.weights.length; j++) {
      linearSum += this.weights[j] * x[j];
    }
    return this.sigmoid(linearSum);
  }

  predict(x, threshold = 0.5) {
    return this.predictProba(x) >= threshold ? 1 : 0;
  }

  toJSON() {
    return {
      type: 'LogisticRegression',
      weights: this.weights,
      bias: this.bias
    };
  }

  static fromJSON(json) {
    const model = new LogisticRegressionModel();
    model.weights = json.weights;
    model.bias = json.bias;
    return model;
  }
}

// ==========================================
// 2. DECISION TREE HELPER
// ==========================================
class TreeNode {
  constructor() {
    this.featureIdx = null;
    this.threshold = null;
    this.left = null;
    this.right = null;
    this.value = null; // probability or class
  }
}

function computeGini(y) {
  if (y.length === 0) return 0;
  const count1 = y.filter(v => v === 1).length;
  const p1 = count1 / y.length;
  const p0 = 1 - p1;
  return 1 - (p1 * p1 + p0 * p0);
}

function buildTree(X, y, depth = 0, maxDepth = 6, minSamples = 4, featureIndices = null) {
  const node = new TreeNode();
  const count1 = y.filter(v => v === 1).length;
  node.value = count1 / y.length;

  if (depth >= maxDepth || y.length <= minSamples || node.value === 0 || node.value === 1) {
    return node;
  }

  const numFeatures = X[0].length;
  const candidateFeatures = featureIndices || Array.from({ length: numFeatures }, (_, i) => i);

  let bestGain = -1;
  let bestFeature = null;
  let bestThreshold = null;
  let bestLeftIndices = null;
  let bestRightIndices = null;

  const currentGini = computeGini(y);

  for (const fIdx of candidateFeatures) {
    const leftIdx = [];
    const rightIdx = [];
    for (let i = 0; i < X.length; i++) {
      if (X[i][fIdx] <= 0.5) {
        leftIdx.push(i);
      } else {
        rightIdx.push(i);
      }
    }

    if (leftIdx.length === 0 || rightIdx.length === 0) continue;

    const yLeft = leftIdx.map(i => y[i]);
    const yRight = rightIdx.map(i => y[i]);
    const leftGini = computeGini(yLeft);
    const rightGini = computeGini(yRight);

    const gain = currentGini - ((leftIdx.length / y.length) * leftGini + (rightIdx.length / y.length) * rightGini);

    if (gain > bestGain) {
      bestGain = gain;
      bestFeature = fIdx;
      bestThreshold = 0.5;
      bestLeftIndices = leftIdx;
      bestRightIndices = rightIdx;
    }
  }

  if (bestGain <= 0.0001 || !bestFeature) {
    return node;
  }

  node.featureIdx = bestFeature;
  node.threshold = bestThreshold;

  const leftX = bestLeftIndices.map(i => X[i]);
  const leftY = bestLeftIndices.map(i => y[i]);
  const rightX = bestRightIndices.map(i => X[i]);
  const rightY = bestRightIndices.map(i => y[i]);

  node.left = buildTree(leftX, leftY, depth + 1, maxDepth, minSamples, featureIndices);
  node.right = buildTree(rightX, rightY, depth + 1, maxDepth, minSamples, featureIndices);

  return node;
}

function evaluateTree(node, x) {
  if (node.featureIdx === null) {
    return node.value;
  }
  if (x[node.featureIdx] <= node.threshold) {
    return evaluateTree(node.left, x);
  } else {
    return evaluateTree(node.right, x);
  }
}

// ==========================================
// 3. RANDOM FOREST MODEL
// ==========================================
class RandomForestModel {
  constructor(numTrees = 45, maxDepth = 7, minSamples = 3) {
    this.numTrees = numTrees;
    this.maxDepth = maxDepth;
    this.minSamples = minSamples;
    this.trees = [];
    this.featureImportances = [];
  }

  fit(X, y) {
    this.trees = [];
    const numSamples = X.length;
    const numFeatures = X[0].length;
    const subsetSize = Math.max(3, Math.floor(Math.sqrt(numFeatures) * 1.5));
    const importanceCounts = new Array(numFeatures).fill(0);

    for (let t = 0; t < this.numTrees; t++) {
      // Bootstrap sample
      const bootX = [];
      const bootY = [];
      for (let i = 0; i < numSamples; i++) {
        const randIdx = Math.floor(Math.random() * numSamples);
        bootX.push(X[randIdx]);
        bootY.push(y[randIdx]);
      }

      // Feature sub-sampling
      const shuffledFeatures = Array.from({ length: numFeatures }, (_, i) => i).sort(() => Math.random() - 0.5);
      const featureIndices = shuffledFeatures.slice(0, subsetSize);

      const tree = buildTree(bootX, bootY, 0, this.maxDepth, this.minSamples, featureIndices);
      this.trees.push(tree);

      // Track feature usage
      const countUsage = (n) => {
        if (!n || n.featureIdx === null) return;
        importanceCounts[n.featureIdx] += 1;
        countUsage(n.left);
        countUsage(n.right);
      };
      countUsage(tree);
    }

    const totalUsage = importanceCounts.reduce((a, b) => a + b, 0) || 1;
    this.featureImportances = importanceCounts.map(c => c / totalUsage);
  }

  predictProba(x) {
    let sumProbs = 0;
    for (const tree of this.trees) {
      sumProbs += evaluateTree(tree, x);
    }
    return sumProbs / this.trees.length;
  }

  predict(x, threshold = 0.5) {
    return this.predictProba(x) >= threshold ? 1 : 0;
  }

  toJSON() {
    return {
      type: 'RandomForest',
      numTrees: this.numTrees,
      trees: this.trees,
      featureImportances: this.featureImportances
    };
  }

  static fromJSON(json) {
    const model = new RandomForestModel(json.numTrees);
    model.trees = json.trees;
    model.featureImportances = json.featureImportances;
    return model;
  }
}

// ==========================================
// 4. XGBOOST / GRADIENT BOOSTING MODEL
// ==========================================
class XGBoostModel {
  constructor(numRounds = 45, maxDepth = 5, learningRate = 0.15, l2Lambda = 1.0) {
    this.numRounds = numRounds;
    this.maxDepth = maxDepth;
    this.lr = learningRate;
    this.lambda = l2Lambda;
    this.baseScore = 0;
    this.trees = [];
    this.featureImportances = [];
  }

  sigmoid(z) {
    return 1 / (1 + Math.exp(-Math.max(-25, Math.min(25, z))));
  }

  fit(X, y) {
    const numSamples = X.length;
    const numFeatures = X[0].length;
    const count1 = y.filter(v => v === 1).length;
    const p0 = count1 / numSamples;
    this.baseScore = Math.log((p0 + 1e-5) / (1 - p0 + 1e-5));

    const currentF = new Array(numSamples).fill(this.baseScore);
    this.trees = [];
    const importanceCounts = new Array(numFeatures).fill(0);

    for (let round = 0; round < this.numRounds; round++) {
      // Compute first and second order gradients
      const gradients = [];
      const hessians = [];
      for (let i = 0; i < numSamples; i++) {
        const prob = this.sigmoid(currentF[i]);
        const grad = y[i] - prob; // first order gradient (residual)
        const hess = Math.max(prob * (1 - prob), 1e-4); // second order hessian
        gradients.push(grad);
        hessians.push(hess);
      }

      // Fit regression tree to gradients / hessians
      const indices = Array.from({ length: numSamples }, (_, i) => i);
      const tree = this.buildXGBTree(X, gradients, hessians, indices, 0);
      this.trees.push(tree);

      // Update predictions with learning rate
      for (let i = 0; i < numSamples; i++) {
        const step = this.evaluateRegTree(tree, X[i]);
        currentF[i] += this.lr * step;
      }

      // Feature importance tracking
      const countUsage = (n) => {
        if (!n || n.featureIdx === null) return;
        importanceCounts[n.featureIdx] += 1;
        countUsage(n.left);
        countUsage(n.right);
      };
      countUsage(tree);
    }

    const totalUsage = importanceCounts.reduce((a, b) => a + b, 0) || 1;
    this.featureImportances = importanceCounts.map(c => c / totalUsage);
  }

  computeLeafValue(gradients, hessians, indices) {
    let sumG = 0;
    let sumH = 0;
    for (const idx of indices) {
      sumG += gradients[idx];
      sumH += hessians[idx];
    }
    return sumG / (sumH + this.lambda);
  }

  computeGain(gradients, hessians, indices) {
    let sumG = 0;
    let sumH = 0;
    for (const idx of indices) {
      sumG += gradients[idx];
      sumH += hessians[idx];
    }
    return (sumG * sumG) / (sumH + this.lambda);
  }

  buildXGBTree(X, gradients, hessians, indices, depth) {
    const node = new TreeNode();
    node.value = this.computeLeafValue(gradients, hessians, indices);

    if (depth >= this.maxDepth || indices.length <= 4) {
      return node;
    }

    const currentScore = this.computeGain(gradients, hessians, indices);
    let bestGain = 0;
    let bestFeature = null;
    let bestLeftIndices = null;
    let bestRightIndices = null;

    const numFeatures = X[0].length;
    for (let fIdx = 0; fIdx < numFeatures; fIdx++) {
      const left = [];
      const right = [];
      for (const i of indices) {
        if (X[i][fIdx] <= 0.5) left.push(i);
        else right.push(i);
      }

      if (left.length < 2 || right.length < 2) continue;

      const leftScore = this.computeGain(gradients, hessians, left);
      const rightScore = this.computeGain(gradients, hessians, right);
      const gain = 0.5 * (leftScore + rightScore - currentScore);

      if (gain > bestGain) {
        bestGain = gain;
        bestFeature = fIdx;
        bestLeftIndices = left;
        bestRightIndices = right;
      }
    }

    if (bestGain <= 0.001 || !bestFeature) {
      return node;
    }

    node.featureIdx = bestFeature;
    node.threshold = 0.5;
    node.left = this.buildXGBTree(X, gradients, hessians, bestLeftIndices, depth + 1);
    node.right = this.buildXGBTree(X, gradients, hessians, bestRightIndices, depth + 1);

    return node;
  }

  evaluateRegTree(node, x) {
    if (node.featureIdx === null) return node.value;
    if (x[node.featureIdx] <= node.threshold) {
      return this.evaluateRegTree(node.left, x);
    } else {
      return this.evaluateRegTree(node.right, x);
    }
  }

  predictProba(x) {
    let score = this.baseScore;
    for (const tree of this.trees) {
      score += this.lr * this.evaluateRegTree(tree, x);
    }
    return this.sigmoid(score);
  }

  predict(x, threshold = 0.5) {
    return this.predictProba(x) >= threshold ? 1 : 0;
  }

  toJSON() {
    return {
      type: 'XGBoost',
      baseScore: this.baseScore,
      numRounds: this.numRounds,
      lr: this.lr,
      lambda: this.lambda,
      trees: this.trees,
      featureImportances: this.featureImportances
    };
  }

  static fromJSON(json) {
    const model = new XGBoostModel(json.numRounds, 5, json.lr, json.lambda || 1.0);
    model.baseScore = json.baseScore;
    model.trees = json.trees;
    model.featureImportances = json.featureImportances;
    return model;
  }
}

// ==========================================
// 5. EVALUATION METRICS HELPER
// ==========================================
function computeMetrics(yTrue, yPred, yProbs) {
  let tp = 0, fp = 0, tn = 0, fn = 0;
  for (let i = 0; i < yTrue.length; i++) {
    if (yTrue[i] === 1 && yPred[i] === 1) tp++;
    else if (yTrue[i] === 0 && yPred[i] === 1) fp++;
    else if (yTrue[i] === 0 && yPred[i] === 0) tn++;
    else if (yTrue[i] === 1 && yPred[i] === 0) fn++;
  }

  const accuracy = (tp + tn) / (tp + tn + fp + fn || 1);
  const precision = tp / (tp + fp || 1);
  const recall = tp / (tp + fn || 1);
  const f1 = (2 * precision * recall) / (precision + recall || 1);

  // Compute ROC-AUC (Rank sum / Wilcoxon-Mann-Whitney method)
  const paired = yTrue.map((yt, idx) => ({ y: yt, p: yProbs[idx] })).sort((a, b) => a.p - b.p);
  const n0 = yTrue.filter(y => y === 0).length;
  const n1 = yTrue.filter(y => y === 1).length;
  let rankSum1 = 0;
  for (let i = 0; i < paired.length; i++) {
    if (paired[i].y === 1) {
      rankSum1 += (i + 1);
    }
  }
  const auc = n0 > 0 && n1 > 0 ? (rankSum1 - (n1 * (n1 + 1)) / 2) / (n0 * n1) : 0.5;

  return {
    accuracy,
    precision,
    recall,
    f1,
    roc_auc: Math.max(0.5, Math.min(1.0, auc)),
    confusion_matrix: [
      [tn, fp],
      [fn, tp]
    ]
  };
}

function computeRocCurveData(yTrue, yProbs) {
  const points = [];
  const thresholds = [1.0, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.0];
  const P = yTrue.filter(y => y === 1).length || 1;
  const N = yTrue.filter(y => y === 0).length || 1;

  for (const thresh of thresholds) {
    let tp = 0, fp = 0;
    for (let i = 0; i < yTrue.length; i++) {
      if (yProbs[i] >= thresh) {
        if (yTrue[i] === 1) tp++;
        else fp++;
      }
    }
    points.push({
      threshold: thresh,
      fpr: parseFloat((fp / N).toFixed(4)),
      tpr: parseFloat((tp / P).toFixed(4))
    });
  }
  return points;
}

// ==========================================
// 6. 5-FOLD STRATIFIED CV ORCHESTRATION
// ==========================================
async function main() {
  console.log("==================================================================");
  console.log("  CEREBRO JAVASCRIPT NATIVE ML TRAINING & 5-FOLD STRATIFIED CV   ");
  console.log("==================================================================");

  const datasetPath = path.join(__dirname, 'dataset', 'procrastination_dataset.csv');
  const processedRecords = await parseDataset(datasetPath);
  console.log(`[INFO] Loaded and validated ${processedRecords.length} student survey records.`);

  // Separate positive and negative classes for stratified split
  const posRecords = processedRecords.filter(r => r.target === 1);
  const negRecords = processedRecords.filter(r => r.target === 0);

  console.log(`[INFO] Class distribution: Procrastinators (1) = ${posRecords.length}, Non-Procrastinators (0) = ${negRecords.length}`);

  const kFolds = 5;
  const foldBuckets = Array.from({ length: kFolds }, () => []);

  // Distribute positives & negatives across folds evenly
  posRecords.forEach((r, i) => foldBuckets[i % kFolds].push(r));
  negRecords.forEach((r, i) => foldBuckets[i % kFolds].push(r));

  const modelClasses = {
    'Logistic Regression': () => new LogisticRegressionModel(0.04, 0.01, 150),
    'Random Forest': () => new RandomForestModel(40, 7, 3),
    'XGBoost': () => new XGBoostModel(35, 4, 0.08)
  };

  const cvResults = {
    'Logistic Regression': { accuracy: [], precision: [], recall: [], f1: [], roc_auc: [], oofPreds: [], oofProbs: [] },
    'Random Forest': { accuracy: [], precision: [], recall: [], f1: [], roc_auc: [], oofPreds: [], oofProbs: [] },
    'XGBoost': { accuracy: [], precision: [], recall: [], f1: [], roc_auc: [], oofPreds: [], oofProbs: [] }
  };

  const allYTrue = [];

  for (let fold = 0; fold < kFolds; fold++) {
    const valRecords = foldBuckets[fold];
    const trainRecords = foldBuckets.filter((_, f) => f !== fold).flat();

    // 1. Fit encoder strictly on train fold
    const foldEncoder = new DatasetEncoder();
    foldEncoder.fit(trainRecords);

    const X_train = trainRecords.map(r => foldEncoder.transform(r.features));
    const y_train = trainRecords.map(r => r.target);
    const X_val = valRecords.map(r => foldEncoder.transform(r.features));
    const y_val = valRecords.map(r => r.target);

    if (fold === 0) {
      allYTrue.push(...y_val);
    } else {
      allYTrue.push(...y_val);
    }

    for (const [mName, mFactory] of Object.entries(modelClasses)) {
      const model = mFactory();
      model.fit(X_train, y_train);

      const valProbs = X_val.map(x => model.predictProba(x));
      const valPreds = valProbs.map(p => p >= 0.5 ? 1 : 0);

      const metrics = computeMetrics(y_val, valPreds, valProbs);
      cvResults[mName].accuracy.push(metrics.accuracy);
      cvResults[mName].precision.push(metrics.precision);
      cvResults[mName].recall.push(metrics.recall);
      cvResults[mName].f1.push(metrics.f1);
      cvResults[mName].roc_auc.push(metrics.roc_auc);
      cvResults[mName].oofPreds.push(...valPreds);
      cvResults[mName].oofProbs.push(...valProbs);
    }
  }

  // Calculate summary metrics
  const performancePayload = {
    models: {},
    featureNames: [],
    datasetSize: processedRecords.length,
    classBalance: {
      procrastinators: posRecords.length,
      nonProcrastinators: negRecords.length,
      procrastinationRate: parseFloat((posRecords.length / processedRecords.length).toFixed(4))
    },
    topFeatures: []
  };

  console.log("\n=========================================================================================");
  console.log("                        5-FOLD CROSS-VALIDATION SUMMARY RESULTS                          ");
  console.log("=========================================================================================");
  console.log("Model                 | Accuracy         | Precision        | Recall           | F1-Score         | ROC-AUC");
  console.log("-----------------------------------------------------------------------------------------");

  const avg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
  const std = arr => {
    const mean = avg(arr);
    return Math.sqrt(arr.reduce((s, v) => s + (v - mean) ** 2, 0) / arr.length);
  };

  for (const [mName, res] of Object.entries(cvResults)) {
    const accMean = avg(res.accuracy);
    const precMean = avg(res.precision);
    const recMean = avg(res.recall);
    const f1Mean = avg(res.f1);
    const aucMean = avg(res.roc_auc);

    const overallMetrics = computeMetrics(allYTrue, res.oofPreds, res.oofProbs);
    const rocData = computeRocCurveData(allYTrue, res.oofProbs);

    performancePayload.models[mName] = {
      accuracy: parseFloat(accMean.toFixed(4)),
      accuracy_std: parseFloat(std(res.accuracy).toFixed(4)),
      precision: parseFloat(precMean.toFixed(4)),
      precision_std: parseFloat(std(res.precision).toFixed(4)),
      recall: parseFloat(recMean.toFixed(4)),
      recall_std: parseFloat(std(res.recall).toFixed(4)),
      f1_score: parseFloat(f1Mean.toFixed(4)),
      f1_score_std: parseFloat(std(res.f1).toFixed(4)),
      roc_auc: parseFloat(aucMean.toFixed(4)),
      roc_auc_std: parseFloat(std(res.roc_auc).toFixed(4)),
      confusion_matrix: overallMetrics.confusion_matrix,
      roc_curve: rocData
    };

    console.log(
      `${mName.padEnd(21)} | ${(accMean.toFixed(4) + ' ± ' + std(res.accuracy).toFixed(4)).padEnd(16)} | ${(precMean.toFixed(4) + ' ± ' + std(res.precision).toFixed(4)).padEnd(16)} | ${(recMean.toFixed(4) + ' ± ' + std(res.recall).toFixed(4)).padEnd(16)} | ${(f1Mean.toFixed(4) + ' ± ' + std(res.f1).toFixed(4)).padEnd(16)} | ${(aucMean.toFixed(4) + ' ± ' + std(res.roc_auc).toFixed(4))}`
    );
  }

  // 7. Retrain winning and candidate models on ALL records
  console.log("\n[INFO] Retraining all final models on full 451 dataset...");
  const fullEncoder = new DatasetEncoder();
  fullEncoder.fit(processedRecords);

  const fullX = processedRecords.map(r => fullEncoder.transform(r.features));
  const fullY = processedRecords.map(r => r.target);

  const trainedLR = new LogisticRegressionModel(0.04, 0.01, 180);
  trainedLR.fit(fullX, fullY);

  const trainedRF = new RandomForestModel(50, 8, 3);
  trainedRF.fit(fullX, fullY);

  const trainedXGB = new XGBoostModel(40, 4, 0.08);
  trainedXGB.fit(fullX, fullY);

  // Compute clean feature importances
  const cleanFeatureNames = fullEncoder.featureNames.map(f => {
    return f
      .replace(/__/g, ': ')
      .replace(/_/g, ' ')
      .replace(/reason /g, 'Reason: ')
      .replace(/\b\w/g, l => l.toUpperCase());
  });

  const featImportanceList = trainedRF.featureImportances.map((imp, idx) => ({
    feature: cleanFeatureNames[idx] || `Feature ${idx}`,
    rawName: fullEncoder.featureNames[idx],
    importance: parseFloat((imp * 100).toFixed(2))
  })).sort((a, b) => b.importance - a.importance);

  performancePayload.featureNames = fullEncoder.featureNames;
  performancePayload.topFeatures = featImportanceList.slice(0, 15);

  // Save trained models & encoder
  const trainedDir = path.join(__dirname, 'trained_models');
  const evalDir = path.join(__dirname, 'evaluation');
  const rootModelsDir = path.join(__dirname, '..', '..', 'models');

  fs.mkdirSync(trainedDir, { recursive: true });
  fs.mkdirSync(evalDir, { recursive: true });
  fs.mkdirSync(path.join(rootModelsDir, 'logistic'), { recursive: true });
  fs.mkdirSync(path.join(rootModelsDir, 'random_forest'), { recursive: true });
  fs.mkdirSync(path.join(rootModelsDir, 'xgboost'), { recursive: true });

  fs.writeFileSync(path.join(trainedDir, 'metadata.json'), JSON.stringify(fullEncoder.toJSON(), null, 2));
  fs.writeFileSync(path.join(trainedDir, 'logistic_regression.json'), JSON.stringify(trainedLR.toJSON(), null, 2));
  fs.writeFileSync(path.join(trainedDir, 'random_forest.json'), JSON.stringify(trainedRF.toJSON(), null, 2));
  fs.writeFileSync(path.join(trainedDir, 'xgboost.json'), JSON.stringify(trainedXGB.toJSON(), null, 2));
  fs.writeFileSync(path.join(evalDir, 'model_performance.json'), JSON.stringify(performancePayload, null, 2));

  // Sync to root models/ directory
  fs.writeFileSync(path.join(rootModelsDir, 'logistic', 'model.json'), JSON.stringify(trainedLR.toJSON(), null, 2));
  fs.writeFileSync(path.join(rootModelsDir, 'random_forest', 'model.json'), JSON.stringify(trainedRF.toJSON(), null, 2));
  fs.writeFileSync(path.join(rootModelsDir, 'xgboost', 'model.json'), JSON.stringify(trainedXGB.toJSON(), null, 2));

  console.log("\n[SUCCESS] Exported all models and performance evaluation artifacts successfully!");
}

if (require.main === module) {
  main().catch(err => {
    console.error("Training error:", err);
    process.exit(1);
  });
}

module.exports = {
  LogisticRegressionModel,
  RandomForestModel,
  XGBoostModel
};
