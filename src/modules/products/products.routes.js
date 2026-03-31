const express = require('express');
const { createCrudRoutes } = require('../../routes/crud.routes');
const Product = require('../../models/product.model');
const { authenticate, authorize } = require('../../middleware/auth');
const { createProductSchema, updateProductSchema, idParamsSchema, listQuerySchema } = require('../../validation/product.validation');

const router = express.Router();

router.use(
  '/',
  createCrudRoutes(Product, {
    validation: {
      create: createProductSchema,
      update: updateProductSchema,
      id: idParamsSchema,
      list: listQuerySchema,
    },
    middlewares: {
      create: [authenticate, authorize('admin')],
      update: [authenticate, authorize('admin')],
      remove: [authenticate, authorize('admin')],
    },
  })
);

module.exports = router;

