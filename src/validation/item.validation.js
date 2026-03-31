const { Joi, idParamsSchema, listQuerySchema } = require('./common.validation');

const createItemSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow('', null),
  imageUrl: Joi.string().allow('', null),
  attachments: Joi.array().items(Joi.string()).default([]),
});

const updateItemSchema = Joi.object({
  name: Joi.string(),
  description: Joi.string().allow('', null),
  imageUrl: Joi.string().allow('', null),
  attachments: Joi.array().items(Joi.string()),
}).min(1);

module.exports = { createItemSchema, updateItemSchema, idParamsSchema, listQuerySchema };

