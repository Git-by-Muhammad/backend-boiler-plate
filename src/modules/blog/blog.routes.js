const express = require('express');
const { createCrudRoutes } = require('../../routes/crud.routes');
const Post = require('../../models/post.model');
const Comment = require('../../models/comment.model');
const { authenticate } = require('../../middleware/auth');
const { assignOwnerOnCreate, adminOrOwner } = require('../../middleware/resourceAccess');
const {
  createPostSchema,
  updatePostSchema,
  createCommentSchema,
  updateCommentSchema,
  idParamsSchema,
  listQuerySchema,
} = require('../../validation/blog.validation');

const router = express.Router();

router.use(
  '/posts',
  createCrudRoutes(Post, {
    validation: {
      create: createPostSchema,
      update: updatePostSchema,
      id: idParamsSchema,
      list: listQuerySchema,
    },
    middlewares: {
      create: [authenticate, assignOwnerOnCreate('author')],
      update: [authenticate, adminOrOwner(Post, 'author')],
      remove: [authenticate, adminOrOwner(Post, 'author')],
    },
  })
);
router.use(
  '/comments',
  createCrudRoutes(Comment, {
    validation: {
      create: createCommentSchema,
      update: updateCommentSchema,
      id: idParamsSchema,
      list: listQuerySchema,
    },
    middlewares: {
      create: [authenticate, assignOwnerOnCreate('author')],
      update: [authenticate, adminOrOwner(Comment, 'author')],
      remove: [authenticate, adminOrOwner(Comment, 'author')],
    },
  })
);

module.exports = router;

