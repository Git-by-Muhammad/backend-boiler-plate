const express = require('express');
const { createCrudController } = require('../controllers/crud.controller');
const { createCrudService } = require('../services/crud.service');

function createCrudRoutes(Model, pathPrefix = '') {
  const router = express.Router({ mergeParams: true });
  const service = createCrudService(Model);
  const controller = createCrudController(service);
  router.post(pathPrefix || '/', controller.create);
  router.get(pathPrefix || '/', controller.getAll);
  router.get('/:id', controller.getById);
  router.patch('/:id', controller.update);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.remove);
  return router;
}

module.exports = { createCrudRoutes };
