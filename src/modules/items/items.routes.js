const express = require('express');
const { createCrudRoutes } = require('../../routes/crud.routes');
const Item = require('../../models/item.model');

const router = express.Router();
router.use('/', createCrudRoutes(Item));

module.exports = router;
