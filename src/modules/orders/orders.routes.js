const express = require('express');
const { createCrudRoutes } = require('../../routes/crud.routes');
const Order = require('../../models/order.model');
const { authenticate } = require('../../middleware/auth');
const { createOrderSchema, updateOrderSchema, idParamsSchema, listQuerySchema } = require('../../validation/order.validation');

const router = express.Router();

router.use(
  '/',
  authenticate,
  createCrudRoutes(Order, {
    validation: {
      create: createOrderSchema,
      update: updateOrderSchema,
      id: idParamsSchema,
      list: listQuerySchema,
    },
  })
);

module.exports = router;

