const { Joi, objectId, idParamsSchema, listQuerySchema } = require('./common.validation');

const createTicketSchema = Joi.object({
  user: objectId.required(),
  subject: Joi.string().required(),
  body: Joi.string().required(),
  status: Joi.string().valid('open', 'in_progress', 'resolved', 'closed').default('open'),
  priority: Joi.string().valid('low', 'medium', 'high').default('medium'),
  attachments: Joi.array().items(Joi.string()).default([]),
});

const updateTicketSchema = Joi.object({
  subject: Joi.string(),
  body: Joi.string(),
  status: Joi.string().valid('open', 'in_progress', 'resolved', 'closed'),
  priority: Joi.string().valid('low', 'medium', 'high'),
  attachments: Joi.array().items(Joi.string()),
}).min(1);

module.exports = { createTicketSchema, updateTicketSchema, idParamsSchema, listQuerySchema };

