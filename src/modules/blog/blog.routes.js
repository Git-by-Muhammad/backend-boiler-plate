const express = require('express');
const { createCrudRoutes } = require('../../routes/crud.routes');
const Post = require('../../models/post.model');
const Comment = require('../../models/comment.model');
const { authenticate } = require('../../middleware/auth');
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
  authenticate,
  createCrudRoutes(Post, {
    validation: {
      create: createPostSchema,
      update: updatePostSchema,
      id: idParamsSchema,
      list: listQuerySchema,
    },
  })
);
router.use(
  '/comments',
  authenticate,
  createCrudRoutes(Comment, {
    validation: {
      create: createCommentSchema,
      update: updateCommentSchema,
      id: idParamsSchema,
      list: listQuerySchema,
    },
  })
);

module.exports = router;

