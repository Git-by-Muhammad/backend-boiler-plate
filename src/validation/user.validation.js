const { Joi, idParamsSchema, listQuerySchema } = require('./common.validation');

const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().min(2).max(100).required(),
  role: Joi.string().valid('user', 'admin').default('user'),
});

const updateUserSchema = Joi.object({
  email: Joi.string().email(),
  password: Joi.string().min(6),
  name: Joi.string().min(2).max(100),
  role: Joi.string().valid('user', 'admin'),
}).min(1);

const updateMeSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
});

module.exports = {
  createUserSchema,
  updateUserSchema,
  updateMeSchema,
  idParamsSchema,
  listQuerySchema,
};

