const asyncHandler = require('../../utils/asyncHandler');
const { register, login } = require('./auth.service');
const User = require('../../models/user.model');
const { sanitizeUser } = require('../../utils/sanitize');

const registerController = asyncHandler(async (req, res) => {
  const user = await register(req.body);
  res.status(201).json(sanitizeUser(user));
});

const loginController = asyncHandler(async (req, res) => {
  const { user, token } = await login(req.body);
  res.json({
    token,
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

module.exports = { registerController, loginController, meController };

