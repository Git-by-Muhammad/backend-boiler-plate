const express = require('express');
const { registerController, loginController, meController } = require('./auth.controller');
const { authenticate } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const { registerSchema, loginSchema } = require('../../validation/auth.validation');

const router = express.Router();

router.post('/register', validate({ body: registerSchema }), registerController);
router.post('/login', validate({ body: loginSchema }), loginController);
router.get('/me', authenticate, meController);

module.exports = router;

