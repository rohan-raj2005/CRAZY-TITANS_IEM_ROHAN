const fs = require('fs');
const csv = require('csv-parser');

const REASON_MAPPINGS = {
  reason_lack_of_interest: ['lack of interest', 'interest'],
  reason_distractions: ['distraction', 'social media', 'e.g., social media'],
  reason_poor_time_management: ['poor time management', 'time management'],
  reason_stress_anxiety: ['stress', 'anxiety', 'stress and anxiety'],
  reason_lack_of_resources: ['lack of resources', 'resources'],
  reason_health_issues: ['health', 'health issues'],
  reason_unclear_instructions: ['unclear', 'professor', 'instructions', 'unclear instructions'],
  reason_personal_family_problems: ['personal', 'family', 'personal family'],
  reason_overconfidence: ['overconfidence', 'overconfident']
};

const CATEGORICAL_COLUMNS = [
  'study_year',
  'socio-economic_background',
  'assignment_submission_timing',
  'last_minute_exam_preparation',
  'stress_due_to_procrastination',
  'study_hours_per_week',
  'cgpa',
  'use_of_time_management',
  'procrastination_management_training',
  'procrastination_recovery_strategies',
  'hours_spent_on_mobile_non_academic',
  'study_session_distractions'
];

const BINARY_REASON_COLUMNS = Object.keys(REASON_MAPPINGS);

function parseReasonsText(reasonsInput) {
  const rawStr = Array.isArray(reasonsInput) ? reasonsInput.join(', ') : String(reasonsInput || '');
  const cleanStr = rawStr.toLowerCase().replace(/_/g, ' ');
  const binaryFeatures = {};
  for (const [featureName, patterns] of Object.entries(REASON_MAPPINGS)) {
    const isSelected = rawStr.includes(featureName) || patterns.some(pattern => cleanStr.includes(pattern.toLowerCase()));
    binaryFeatures[featureName] = isSelected ? 1 : 0;
  }
  return binaryFeatures;
}

function parseDataset(filePath) {
  return new Promise((resolve, reject) => {
    const records = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => records.push(row))
      .on('end', () => {
        const processedRows = [];
        for (const row of records) {
          // 1. Target creation: Always/Often -> 1, Sometimes/Occasionally/Never -> 0
          const delayVal = (row['assignment_delay_frequency'] || '').trim();
          if (!delayVal) continue;
          const target = (delayVal === 'Always' || delayVal === 'Often') ? 1 : 0;

          // 2. Multi-reason binary parsing
          const reasonFeatures = parseReasonsText(row['procrastination_reasons']);

          // 3. Keep only allowable features
          const featureRow = {};
          for (const catCol of CATEGORICAL_COLUMNS) {
            featureRow[catCol] = (row[catCol] || '').trim();
          }
          for (const binCol of BINARY_REASON_COLUMNS) {
            featureRow[binCol] = reasonFeatures[binCol];
          }

          processedRows.push({
            features: featureRow,
            target: target,
            raw: row
          });
        }
        resolve(processedRows);
      })
      .on('error', reject);
  });
}

class DatasetEncoder {
  constructor() {
    this.catEncodings = {};
    this.featureNames = [];
    this.modes = {};
  }

  fit(records) {
    // 1. Find modes for missing value handling
    for (const catCol of CATEGORICAL_COLUMNS) {
      const counts = {};
      const uniqueVals = new Set();
      for (const rec of records) {
        const val = rec.features[catCol];
        if (val) {
          counts[val] = (counts[val] || 0) + 1;
          uniqueVals.add(val);
        }
      }
      let modeVal = '';
      let maxCount = -1;
      for (const [val, count] of Object.entries(counts)) {
        if (count > maxCount) {
          maxCount = count;
          modeVal = val;
        }
      }
      this.modes[catCol] = modeVal || 'Unknown';
      this.catEncodings[catCol] = Array.from(uniqueVals).sort();
    }

    // 2. Construct one-hot feature names
    this.featureNames = [];
    for (const catCol of CATEGORICAL_COLUMNS) {
      for (const catVal of this.catEncodings[catCol]) {
        this.featureNames.push(`${catCol}__${catVal}`);
      }
    }
    for (const binCol of BINARY_REASON_COLUMNS) {
      this.featureNames.push(binCol);
    }
  }

  transform(recordFeatures) {
    const vector = [];
    for (const catCol of CATEGORICAL_COLUMNS) {
      let val = recordFeatures[catCol];
      if (!val || val === '') {
        val = this.modes[catCol];
      }
      const allowedVals = this.catEncodings[catCol] || [];
      for (const catVal of allowedVals) {
        vector.push(val === catVal ? 1 : 0);
      }
    }
    for (const binCol of BINARY_REASON_COLUMNS) {
      const val = recordFeatures[binCol];
      vector.push(val === 1 || val === true || val === '1' ? 1 : 0);
    }
    return vector;
  }

  toJSON() {
    return {
      catEncodings: this.catEncodings,
      featureNames: this.featureNames,
      modes: this.modes
    };
  }

  static fromJSON(json) {
    const encoder = new DatasetEncoder();
    encoder.catEncodings = json.catEncodings;
    encoder.featureNames = json.featureNames;
    encoder.modes = json.modes;
    return encoder;
  }
}

module.exports = {
  CATEGORICAL_COLUMNS,
  BINARY_REASON_COLUMNS,
  REASON_MAPPINGS,
  parseReasonsText,
  parseDataset,
  DatasetEncoder
};
