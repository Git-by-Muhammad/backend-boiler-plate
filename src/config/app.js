const express = require('express');
const cors = require('cors');

const healthRouter = require('../routes/health.routes');

const app = express();

// Global middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/health', healthRouter);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.statusCode || 500;
  res.status(status).json({
    message: err.message || 'Internal server error',
  });
});

module.exports = app;


