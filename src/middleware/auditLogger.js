const logger = require('../utils/logger');

const sanitizeBody = (body = {}) => {
  const clone = { ...body };
  if ('password' in clone) clone.password = '[REDACTED]';
  if ('passwordHash' in clone) clone.passwordHash = '[REDACTED]';
  if ('refreshToken' in clone) clone.refreshToken = '[REDACTED]';
  return clone;
};

const auditLogger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    if (req.method === 'GET' || req.method === 'HEAD') return;
    logger.info('AUDIT', {
      correlationId: req.correlationId,
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      durationMs: Date.now() - start,
      actorId: req.user?.id || null,
      body: sanitizeBody(req.body),
    });
  });

  next();
};

module.exports = auditLogger;

