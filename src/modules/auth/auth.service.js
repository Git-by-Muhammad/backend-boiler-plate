const bcrypt = require('bcryptjs');
const User = require('../../models/user.model');
const ApiError = require('../../utils/ApiError');
const { issueTokenPair } = require('../../services/token.service');

async function register({ email, password, name }) {
  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(409, 'Email already in use');
  }
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  const user = await User.create({ email, passwordHash, name });
  return user;
}

async function login({ email, password }) {
  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    throw new ApiError(401, 'Invalid credentials');
  }
  const tokens = await issueTokenPair(user);
  return { user, ...tokens };
}

module.exports = { register, login };

