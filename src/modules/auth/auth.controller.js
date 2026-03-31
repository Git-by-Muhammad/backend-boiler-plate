const asyncHandler = require('../../utils/asyncHandler');
const { register, login } = require('./auth.service');
const User = require('../../models/user.model');
const { sanitizeUser } = require('../../utils/sanitize');
const {
  rotateRefreshToken,
  revokeRefreshToken,
  revokeAccessToken,
} = require('../../services/token.service');

const registerController = asyncHandler(async (req, res) => {
  const user = await register(req.body);
  res.status(201).json(sanitizeUser(user));
});

const loginController = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await login(req.body);
  res.json({
    accessToken,
    refreshToken,
    user: sanitizeUser(user),
  });
});

const meController = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).lean();
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(sanitizeUser(user));
});

const refreshController = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const tokens = await rotateRefreshToken(refreshToken);
  res.json(tokens);
});

const logoutController = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const tokenId = req.user?.tokenId;
  const userId = req.user?.id;
  const expiresAt = req.user?.expiresAt;

  if (refreshToken) {
    await revokeRefreshToken(refreshToken);
  }

  if (tokenId && userId && expiresAt) {
    await revokeAccessToken(tokenId, userId, expiresAt, 'logout');
  }

  res.status(204).send();
});

module.exports = { registerController, loginController, meController, refreshController, logoutController };

