const express = require('express');
const healthRouter = require('./health.routes');
const uploadRouter = require('./upload.routes');
const itemsRouter = require('../modules/items');
const authRouter = require('../modules/auth/auth.routes');
const usersRouter = require('../modules/users');
const productsRouter = require('../modules/products');
const ordersRouter = require('../modules/orders');
const ticketsRouter = require('../modules/tickets');
const blogRouter = require('../modules/blog');
const adminRouter = require('./admin.routes');

const router = express.Router();

router.use('/health', healthRouter);
router.use('/auth', authRouter);
router.use('/upload', uploadRouter);
router.use('/items', itemsRouter);
router.use('/users', usersRouter);
router.use('/products', productsRouter);
router.use('/orders', ordersRouter);
router.use('/tickets', ticketsRouter);
router.use('/blog', blogRouter);
router.use('/admin', adminRouter);

module.exports = router;
