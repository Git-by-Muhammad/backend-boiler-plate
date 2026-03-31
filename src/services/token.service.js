const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const RefreshToken = require('../models/refreshToken.model');
const RevokedToken = require('../models/revokedToken.model');
const ApiError = require('../utils/ApiError');

const parseTtlToSeconds = (ttl) => {
  if (!ttl) return 0;
  const m = String(ttl).match(/^(\d+)([smhd])$/i);
  if (!m) return Number(ttl) || 0;
  const value = Number(m[1]);
  const unit = m[2].toLowerCase();
  if (unit === 's') return value;
  if (unit === 'm') return value * 60;
  if (unit === 'h') return value * 3600;
  if (unit === 'd') return value * 86400;
  return value;
};

const makeJwt = (user, tokenId, type, expiresIn) =>
  jwt.sign(
    { sub: user.id, role: user.role, email: user.email, jti: tokenId, type },
    env.jwtSecret,
    { expiresIn }
  );

async function issueTokenPair(user) {
  const accessTokenId = crypto.randomUUID();
  const refreshTokenId = crypto.randomUUID();

  const accessToken = makeJwt(user, accessTokenId, 'access', env.jwtExpiresIn);
  const refreshToken = makeJwt(user, refreshTokenId, 'refresh', env.jwtRefreshExpiresIn);

  const refreshTtlSeconds = parseTtlToSeconds(env.jwtRefreshExpiresIn);
  const expiresAt = new Date(Date.now() + refreshTtlSeconds * 1000);

  await RefreshToken.create({
    tokenId: refreshTokenId,
    user: user.id,
    expiresAt,
  });

  return { accessToken, refreshToken };
}

async function revokeAccessToken(tokenId, userId, expiresAt, reason = 'logout') {
  if (!tokenId || !userId || !expiresAt) return;
  await RevokedToken.updateOne(
    { tokenId },
    { tokenId, user: userId, tokenType: 'access', expiresAt: new Date(expiresAt * 1000), reason },
    { upsert: true }
  );
}

async function rotateRefreshToken(rawRefreshToken) {
  let payload;
  try {
    payload = jwt.verify(rawRefreshToken, env.jwtSecret);
  } catch {
    throw new ApiError(401, 'Invalid refresh token');
  }

  if (payload.type !== 'refresh') {
    throw new ApiError(401, 'Invalid refresh token');
  }

  const refreshRecord = await RefreshToken.findOne({ tokenId: payload.jti });
  if (!refreshRecord || refreshRecord.revokedAt || refreshRecord.expiresAt < new Date()) {
    throw new ApiError(401, 'Refresh token is revoked or expired');
  }

  const user = { id: payload.sub, role: payload.role, email: payload.email };
  const nextPair = await issueTokenPair(user);
  const nextPayload = jwt.decode(nextPair.refreshToken);

  refreshRecord.revokedAt = new Date();
  refreshRecord.replacedByTokenId = nextPayload.jti;
  await refreshRecord.save();

  await RevokedToken.updateOne(
    { tokenId: payload.jti },
    {
      tokenId: payload.jti,
      user: payload.sub,
      tokenType: 'refresh',
      expiresAt: new Date(payload.exp * 1000),
      reason: 'rotated',
    },
    { upsert: true }
  );

  return nextPair;
}

async function revokeRefreshToken(rawRefreshToken) {
  let payload;
  try {
    payload = jwt.verify(rawRefreshToken, env.jwtSecret);
  } catch {
    throw new ApiError(401, 'Invalid refresh token');
  }

  if (payload.type !== 'refresh') {
    throw new ApiError(401, 'Invalid refresh token');
  }

  await RefreshToken.updateOne(
    { tokenId: payload.jti },
    { revokedAt: new Date() }
  );

  await RevokedToken.updateOne(
    { tokenId: payload.jti },
    {
      tokenId: payload.jti,
      user: payload.sub,
      tokenType: 'refresh',
      expiresAt: new Date(payload.exp * 1000),
      reason: 'logout',
    },
    { upsert: true }
  );
}

async function isAccessTokenRevoked(tokenId) {
  if (!tokenId) return false;
  const record = await RevokedToken.findOne({ tokenId, tokenType: 'access' }).lean();
  return Boolean(record);
}

module.exports = {
  issueTokenPair,
  rotateRefreshToken,
  revokeRefreshToken,
  revokeAccessToken,
  isAccessTokenRevoked,
};

