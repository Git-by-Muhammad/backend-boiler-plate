const express = require('express');
const { createCrudRoutes } = require('../../routes/crud.routes');
const Item = require('../../models/item.model');
const { createItemSchema, updateItemSchema, idParamsSchema, listQuerySchema } = require('../../validation/item.validation');

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
  })
);

module.exports = router;
