const express = require('express');
const {
  registerController,
  loginController,
  meController,
  refreshController,
  logoutController,
} = require('./auth.controller');
const { authenticate } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { registerSchema, loginSchema, refreshSchema } = require('../../validation/auth.validation');
const { authLimiter } = require('../../middleware/rateLimiter');

const router = express.Router();

router.post('/register', authLimiter, validate({ body: registerSchema }), registerController);
router.post('/login', authLimiter, validate({ body: loginSchema }), loginController);
router.post('/refresh', authLimiter, validate({ body: refreshSchema }), refreshController);
router.post('/logout', authenticate, validate({ body: refreshSchema }), logoutController);
router.get('/me', authenticate, meController);

module.exports = router;

