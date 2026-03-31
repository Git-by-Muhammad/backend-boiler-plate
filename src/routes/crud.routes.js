const express = require('express');
const { createCrudController } = require('../controllers/crud.controller');
const { createCrudService } = require('../services/crud.service');
const validate = require('../middleware/validate');

function createCrudRoutes(Model, options = {}) {
  const { pathPrefix = '', validation = {}, middlewares = {} } = options;
  const router = express.Router({ mergeParams: true });
  const service = createCrudService(Model);
  const controller = createCrudController(service);

  const createValidator = validation.create ? [validate({ body: validation.create })] : [];
  const updateValidator = validation.update ? [validate({ body: validation.update })] : [];
  const listValidator = validation.list ? [validate({ query: validation.list })] : [];
  const idValidator = validation.id ? [validate({ params: validation.id })] : [];
  const createMiddlewares = middlewares.create || [];
  const listMiddlewares = middlewares.list || [];
  const getByIdMiddlewares = middlewares.getById || [];
  const updateMiddlewares = middlewares.update || [];
  const removeMiddlewares = middlewares.remove || [];

  router.post(pathPrefix || '/', ...createMiddlewares, ...createValidator, controller.create);
  router.get(pathPrefix || '/', ...listMiddlewares, ...listValidator, controller.getAll);
  router.get('/:id', ...getByIdMiddlewares, ...idValidator, controller.getById);
  router.patch('/:id', ...updateMiddlewares, ...idValidator, ...updateValidator, controller.update);
  router.put('/:id', ...updateMiddlewares, ...idValidator, ...updateValidator, controller.update);
  router.delete('/:id', ...removeMiddlewares, ...idValidator, controller.remove);
  return router;
}

module.exports = { createCrudRoutes };
