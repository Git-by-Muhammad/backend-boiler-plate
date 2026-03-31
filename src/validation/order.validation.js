const { Joi, objectId, idParamsSchema, listQuerySchema } = require('./common.validation');

const createOrderSchema = Joi.object({
  user: objectId.required(),
  items: Joi.array().items(
    Joi.object({
      product: objectId.required(),
      quantity: Joi.number().integer().min(1).required(),
      unitPrice: Joi.number().min(0).required(),
    })
  ).min(1).required(),
  total: Joi.number().min(0).required(),
  status: Joi.string().valid('pending', 'paid', 'shipped', 'delivered', 'cancelled').default('pending'),
});

const updateOrderSchema = Joi.object({
  items: Joi.array().items(
    Joi.object({
      product: objectId.required(),
      quantity: Joi.number().integer().min(1).required(),
      unitPrice: Joi.number().min(0).required(),
    })
  ),
  total: Joi.number().min(0),
  status: Joi.string().valid('pending', 'paid', 'shipped', 'delivered', 'cancelled'),
}).min(1);

module.exports = { createOrderSchema, updateOrderSchema, idParamsSchema, listQuerySchema };

