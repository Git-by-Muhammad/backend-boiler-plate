const crypto = require('crypto');

const HEADER_NAME = 'x-correlation-id';

const correlationId = (req, res, next) => {
  const incoming = req.headers[HEADER_NAME];
  req.correlationId = incoming || crypto.randomUUID();
  res.setHeader(HEADER_NAME, req.correlationId);
  next();
};

module.exports = correlationId;

