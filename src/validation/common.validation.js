const Joi = require('joi');

const objectId = Joi.string().hex().length(24);

const idParamsSchema = Joi.object({
  id: objectId.required(),
});

const listQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  sort: Joi.string().default('-createdAt'),
  search: Joi.string().allow('', null),
  fields: Joi.string().allow('', null),
  populate: Joi.string().allow('', null),
}).unknown(true);

module.exports = { Joi, objectId, idParamsSchema, listQuerySchema };

