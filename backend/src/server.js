const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const predictionRoutes = require('./routes/predictionRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const modelRoutes = require('./routes/modelRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'STUDY PULSE AI Procrastination Detection API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api', predictionRoutes);
app.use('/api', analyticsRoutes);
app.use('/api', modelRoutes);

// Static frontend serving (Production single-server deployment)
const path = require('path');
const fs = require('fs');
const frontendDist = path.join(__dirname, '../../frontend/dist');

if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.url.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

// Fallback 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: `API endpoint '${req.originalUrl}' not found.`,
      type: 'NotFoundError'
    }
  });
});

app.use((req, res) => {
  if (fs.existsSync(frontendDist)) {
    return res.sendFile(path.join(frontendDist, 'index.html'));
  }
  res.status(404).json({
    success: false,
    error: {
      message: `Resource '${req.originalUrl}' not found.`,
      type: 'NotFoundError'
    }
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(config.PORT, () => {
  console.log(`=======================================================`);
  console.log(`⚡ STUDY PULSE API Server is running on port ${config.PORT}`);
  console.log(`🌐 Health check: http://localhost:${config.PORT}/api/health`);
  console.log(`📊 Analytics:    http://localhost:${config.PORT}/api/analytics`);
  console.log(`🎯 Models:       http://localhost:${config.PORT}/api/models/performance`);
  console.log(`=======================================================`);
});

module.exports = app;
