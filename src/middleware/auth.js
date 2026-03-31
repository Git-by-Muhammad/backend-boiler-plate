const jwt = require('jsonwebtoken');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');
const { isAccessTokenRevoked } = require('../services/token.service');

const authenticate = async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return next(new ApiError(401, 'Authentication required'));
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    if (payload.type && payload.type !== 'access') {
      return next(new ApiError(401, 'Invalid token type'));
    }
    const revoked = await isAccessTokenRevoked(payload.jti);
    if (revoked) {
      return next(new ApiError(401, 'Token has been revoked'));
    }
    req.user = {
      id: payload.sub,
      role: payload.role,
      email: payload.email,
      tokenId: payload.jti,
      expiresAt: payload.exp,
    };
    return next();
  } catch {
    return next(new ApiError(401, 'Invalid or expired token'));
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!req.user) {
    return next(new ApiError(401, 'Authentication required'));
  }
  if (!roles.length || roles.includes(req.user.role)) {
    return next();
  }
  return next(new ApiError(403, 'Forbidden'));
};

module.exports = { authenticate, authorize };

