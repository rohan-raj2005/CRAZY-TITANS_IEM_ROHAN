require('dotenv').config();
const path = require('path');

module.exports = {
  PORT: process.env.PORT || 5000,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  MONGO_URI: process.env.MONGO_URI || '',
  USE_MONGO: process.env.USE_MONGO === 'true',
  DATASET_PATH: process.env.DATASET_PATH || path.join(__dirname, '..', '..', 'ml', 'dataset', 'procrastination_dataset.csv'),
  TRAINED_MODELS_DIR: path.join(__dirname, '..', '..', 'ml', 'trained_models'),
  EVALUATION_DIR: path.join(__dirname, '..', '..', 'ml', 'evaluation')
};
