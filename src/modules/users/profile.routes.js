const express = require('express');
const asyncHandler = require('../../utils/asyncHandler');
const User = require('../../models/user.model');
const { authenticate } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { updateMeSchema } = require('../../validation/user.validation');
const { sanitizeUser } = require('../../utils/sanitize');

const router = express.Router();

router.get('/me', authenticate, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).lean();
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(sanitizeUser(user));
}));

router.patch('/me', authenticate, validate({ body: updateMeSchema }), asyncHandler(async (req, res) => {
  const updates = { name: req.body.name };
  const user = await User.findByIdAndUpdate(req.user.id, updates, {
    new: true,
    runValidators: true,
  }).lean();
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(sanitizeUser(user));
}));

module.exports = router;

