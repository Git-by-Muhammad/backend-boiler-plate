const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/user.model');
const ApiError = require('../../utils/ApiError');
const env = require('../../config/env');

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
  const token = jwt.sign(
    { sub: user.id, role: user.role, email: user.email },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );
  return { user, token };
}

module.exports = { register, login };

