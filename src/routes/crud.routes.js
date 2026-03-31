const express = require('express');
const { createCrudController } = require('../controllers/crud.controller');
const { createCrudService } = require('../services/crud.service');
const validate = require('../middleware/validate');

function createCrudRoutes(Model, options = {}) {
  const { pathPrefix = '', validation = {} } = options;
  const router = express.Router({ mergeParams: true });
  const service = createCrudService(Model);
  const controller = createCrudController(service);

  const createValidator = validation.create ? [validate({ body: validation.create })] : [];
  const updateValidator = validation.update ? [validate({ body: validation.update })] : [];
  const listValidator = validation.list ? [validate({ query: validation.list })] : [];
  const idValidator = validation.id ? [validate({ params: validation.id })] : [];

  router.post(pathPrefix || '/', ...createValidator, controller.create);
  router.get(pathPrefix || '/', ...listValidator, controller.getAll);
  router.get('/:id', ...idValidator, controller.getById);
  router.patch('/:id', ...idValidator, ...updateValidator, controller.update);
  router.put('/:id', ...idValidator, ...updateValidator, controller.update);
  router.delete('/:id', controller.remove);
  return router;
}

module.exports = { createCrudRoutes };
