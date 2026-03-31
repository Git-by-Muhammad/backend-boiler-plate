const express = require('express');
const { createCrudRoutes } = require('../../routes/crud.routes');
const Order = require('../../models/order.model');
const { authenticate } = require('../../middleware/auth');
const { createOrderSchema, updateOrderSchema, idParamsSchema, listQuerySchema } = require('../../validation/order.validation');
const { assignOwnerOnCreate, scopeQueryToOwner, adminOrOwner } = require('../../middleware/resourceAccess');

const router = express.Router();

router.use(
  '/',
  createCrudRoutes(Order, {
    validation: {
      create: createOrderSchema,
      update: updateOrderSchema,
      id: idParamsSchema,
      list: listQuerySchema,
    },
    middlewares: {
      create: [authenticate, assignOwnerOnCreate('user')],
      list: [authenticate, scopeQueryToOwner('user')],
      getById: [authenticate, adminOrOwner(Order, 'user')],
      update: [authenticate, adminOrOwner(Order, 'user')],
      remove: [authenticate, adminOrOwner(Order, 'user')],
    },
  })
);

module.exports = router;

