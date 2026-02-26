const ApiError = require('../utils/ApiError');

function createCrudService(Model) {
  return {
    async create(body) {
      return Model.create(body);
    },
    async getById(id) {
      const doc = await Model.findById(id);
      if (!doc) throw new ApiError(404, `${Model.modelName} not found`);
      return doc;
    },
    async getAll(query = {}, options = {}) {
      const { page = 1, limit = 20, sort = '-createdAt' } = options;
      const skip = (Number(page) - 1) * Number(limit);
      const [data, total] = await Promise.all([
        Model.find(query).sort(sort).skip(skip).limit(Number(limit)).lean(),
        Model.countDocuments(query),
      ]);
      return { data, total, page: Number(page), limit: Number(limit) };
    },
    async update(id, body) {
      const doc = await Model.findByIdAndUpdate(id, body, { new: true, runValidators: true });
      if (!doc) throw new ApiError(404, `${Model.modelName} not found`);
      return doc;
    },
    async remove(id) {
      const doc = await Model.findByIdAndDelete(id);
      if (!doc) throw new ApiError(404, `${Model.modelName} not found`);
      return doc;
    },
  };
}

module.exports = { createCrudService };
