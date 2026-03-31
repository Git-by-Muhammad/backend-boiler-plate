const express = require('express');
const mongoose = require('mongoose');
const env = require('../config/env');

const router = express.Router();

router.get('/', (req, res) => {
  const dbStates = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  const readyState = mongoose.connection.readyState;
  res.json({
    status: readyState === 1 ? 'ok' : 'degraded',
    service: 'backend-boiler-plate',
    environment: env.nodeEnv,
    uptimeSeconds: Math.floor(process.uptime()),
    db: {
      state: dbStates[readyState] || 'unknown',
      readyState,
    },
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;


