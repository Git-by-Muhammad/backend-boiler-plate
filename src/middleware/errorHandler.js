const logger = require('../utils/logger');
const env = require('../config/env');

const errorHandler = (err, req, res, _next) => {
  logger.error(err);
  let statusCode = err.statusCode || 500;
  if (err.code && err.code.startsWith('LIMIT_')) statusCode = 400;
  const payload = {
    message: err.message || 'Internal server error',
  };
  if (env.nodeEnv !== 'production' && err.stack) {
    payload.stack = err.stack;
  }
  res.status(statusCode).json(payload);
};

module.exports = errorHandler;
