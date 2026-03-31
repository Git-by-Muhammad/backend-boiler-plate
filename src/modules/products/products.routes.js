const express = require('express');
const { createCrudRoutes } = require('../../routes/crud.routes');
const Product = require('../../models/product.model');
const { authenticate } = require('../../middleware/auth');
const { createProductSchema, updateProductSchema, idParamsSchema, listQuerySchema } = require('../../validation/product.validation');

const router = express.Router();

router.use(
  '/',
  authenticate,
  createCrudRoutes(Product, {
    validation: {
      create: createProductSchema,
      update: updateProductSchema,
      id: idParamsSchema,
      list: listQuerySchema,
    },
  })
);

module.exports = router;

