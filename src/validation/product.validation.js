const { Joi, idParamsSchema, listQuerySchema } = require('./common.validation');

const createProductSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow('', null),
  price: Joi.number().min(0).required(),
  stock: Joi.number().integer().min(0).default(0),
  images: Joi.array().items(Joi.string().uri()).default([]),
  active: Joi.boolean().default(true),
});

const updateProductSchema = Joi.object({
  name: Joi.string(),
  description: Joi.string().allow('', null),
  price: Joi.number().min(0),
  stock: Joi.number().integer().min(0),
  images: Joi.array().items(Joi.string().uri()),
  active: Joi.boolean(),
}).min(1);

module.exports = { createProductSchema, updateProductSchema, idParamsSchema, listQuerySchema };

