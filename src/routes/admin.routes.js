const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { authenticate, authorize } = require('../middleware/auth');
const User = require('../models/user.model');
const Item = require('../models/item.model');
const Product = require('../models/product.model');
const Order = require('../models/order.model');
const Ticket = require('../models/ticket.model');
const Post = require('../models/post.model');
const Comment = require('../models/comment.model');

const router = express.Router();

router.get(
  '/diagnostics',
  authenticate,
  authorize('admin'),
  asyncHandler(async (req, res) => {
    const [users, items, products, orders, tickets, posts, comments] = await Promise.all([
      User.countDocuments(),
      Item.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Ticket.countDocuments(),
      Post.countDocuments(),
      Comment.countDocuments(),
    ]);

    res.json({
      collections: { users, items, products, orders, tickets, posts, comments },
      generatedAt: new Date().toISOString(),
    });
  })
);

module.exports = router;

