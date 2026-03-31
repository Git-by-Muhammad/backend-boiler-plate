const express = require('express');
const { createCrudRoutes } = require('../../routes/crud.routes');
const Item = require('../../models/item.model');
const { createItemSchema, updateItemSchema, idParamsSchema, listQuerySchema } = require('../../validation/item.validation');
const { authenticate, authorize } = require('../../middleware/auth');

const router = express.Router();
router.use(
  '/',
  createCrudRoutes(Item, {
    validation: {
      create: createItemSchema,
      update: updateItemSchema,
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
