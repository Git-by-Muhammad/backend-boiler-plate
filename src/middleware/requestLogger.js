const jwt = require('jsonwebtoken');
const env = require('../config/env');
const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
  const start = Date.now();

  let userId = 'anonymous';
  const authHeader = req.headers.authorization || '';
  if (authHeader.startsWith('Bearer ')) {
    try {
      const payload = jwt.verify(authHeader.slice(7), env.jwtSecret);
      userId = payload.sub || 'anonymous';
    } catch {
      userId = 'anonymous';
    }
  }

  res.on('finish', () => {
    const durationMs = Date.now() - start;
    logger.info(
      `${req.method} ${req.originalUrl} ${res.statusCode} ${durationMs}ms user=${userId} correlationId=${req.correlationId}`
    );
  });

  next();
};

module.exports = requestLogger;

