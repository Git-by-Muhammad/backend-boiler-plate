const express = require('express');
const { createCrudRoutes } = require('../../routes/crud.routes');
const User = require('../../models/user.model');
const { authenticate, authorize } = require('../../middleware/auth');
const { createUserSchema, updateUserSchema, idParamsSchema, listQuerySchema } = require('../../validation/user.validation');
const { hashPasswordIfPresent } = require('../../middleware/hashPassword');

const router = express.Router();

// Admin: full user management
router.use(
  '/',
  authenticate,
  authorize('admin'),
  createCrudRoutes(User, {
    validation: {
      create: createUserSchema,
      update: updateUserSchema,
      id: idParamsSchema,
      list: listQuerySchema,
    },
    middlewares: {
      create: [hashPasswordIfPresent],
      update: [hashPasswordIfPresent],
    },
  })
);

module.exports = router;

