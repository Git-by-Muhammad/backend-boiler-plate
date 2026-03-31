const asyncHandler = require('../utils/asyncHandler');

function createCrudController(service) {
  return {
    create: asyncHandler(async (req, res) => {
      const doc = await service.create(req.body);
      res.status(201).json(doc);
    }),
    getById: asyncHandler(async (req, res) => {
      const doc = await service.getById(req.params.id);
      res.json(doc);
    }),
    getAll: asyncHandler(async (req, res) => {
      const { page, limit, sort, fields, populate, search, ...query } = req.query;
      const result = await service.getAll(query, { page, limit, sort, fields, populate, search });
      res.json(result);
    }),
    update: asyncHandler(async (req, res) => {
      const doc = await service.update(req.params.id, req.body);
      res.json(doc);
    }),
    remove: asyncHandler(async (req, res) => {
      await service.remove(req.params.id);
      res.status(204).send();
    }),
  };
}

module.exports = { createCrudController };
