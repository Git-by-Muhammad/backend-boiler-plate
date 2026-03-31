const { Joi, objectId, idParamsSchema, listQuerySchema } = require('./common.validation');

const createPostSchema = Joi.object({
  author: objectId.required(),
  title: Joi.string().required(),
  content: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).default([]),
  published: Joi.boolean().default(false),
});

const updatePostSchema = Joi.object({
  title: Joi.string(),
  content: Joi.string(),
  tags: Joi.array().items(Joi.string()),
  published: Joi.boolean(),
}).min(1);

const createCommentSchema = Joi.object({
  post: objectId.required(),
  author: objectId.required(),
  content: Joi.string().required(),
});

const updateCommentSchema = Joi.object({
  content: Joi.string().required(),
}).min(1);

module.exports = {
  createPostSchema,
  updatePostSchema,
  createCommentSchema,
  updateCommentSchema,
  idParamsSchema,
  listQuerySchema,
};

