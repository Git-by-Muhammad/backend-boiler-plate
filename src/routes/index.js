const express = require('express');
const healthRouter = require('./health.routes');
const uploadRouter = require('./upload.routes');
const itemsRouter = require('../modules/items');

const router = express.Router();
router.use('/health', healthRouter);
router.use('/upload', uploadRouter);
router.use('/items', itemsRouter);

module.exports = router;
