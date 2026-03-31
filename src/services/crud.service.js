const ApiError = require('../utils/ApiError');
const { stripSensitiveFields } = require('../utils/sanitize');

const toBooleanIfPossible = (value) => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return value;
};

const buildFilterQuery = (query = {}) => {
  const mongoQuery = {};
  for (const [key, rawValue] of Object.entries(query)) {
    if (rawValue === undefined || rawValue === null || rawValue === '') continue;

    if (key.endsWith('Min')) {
      const field = key.slice(0, -3);
      mongoQuery[field] = { ...(mongoQuery[field] || {}), $gte: Number(rawValue) };
      continue;
    }
    if (key.endsWith('Max')) {
      const field = key.slice(0, -3);
      mongoQuery[field] = { ...(mongoQuery[field] || {}), $lte: Number(rawValue) };
      continue;
    }
    if (key.endsWith('Like')) {
      const field = key.slice(0, -4);
      mongoQuery[field] = { $regex: String(rawValue), $options: 'i' };
      continue;
    }
    mongoQuery[key] = toBooleanIfPossible(rawValue);
  }
  return mongoQuery;
};

function createCrudService(Model) {
  return {
    async create(body) {
      const doc = await Model.create(body);
      return stripSensitiveFields(doc);
    },
    async getById(id) {
      const doc = await Model.findById(id);
      if (!doc) throw new ApiError(404, `${Model.modelName} not found`);
      return stripSensitiveFields(doc);
    },
    async getAll(query = {}, options = {}) {
      const { page = 1, limit = 20, sort = '-createdAt', fields, populate, search } = options;
      const skip = (Number(page) - 1) * Number(limit);
      const mongoQuery = buildFilterQuery(query);
      let findQuery = Model.find(mongoQuery);

      if (search) {
        const searchRegex = new RegExp(search, 'i');
        findQuery = findQuery.or([
          { name: searchRegex },
          { title: searchRegex },
          { email: searchRegex },
          { subject: searchRegex },
        ]);
      }

      if (fields) findQuery = findQuery.select(String(fields).split(',').join(' '));
      if (populate) {
        const populateFields = String(populate).split(',').map((p) => p.trim()).filter(Boolean);
        for (const path of populateFields) {
          findQuery = findQuery.populate(path);
        }
      }

      const [data, total] = await Promise.all([
        findQuery.sort(sort).skip(skip).limit(Number(limit)).lean(),
        Model.countDocuments(mongoQuery),
      ]);
      return { data: stripSensitiveFields(data), total, page: Number(page), limit: Number(limit) };
    },
    async update(id, body) {
      const doc = await Model.findByIdAndUpdate(id, body, { new: true, runValidators: true });
      if (!doc) throw new ApiError(404, `${Model.modelName} not found`);
      return stripSensitiveFields(doc);
    },
    async remove(id) {
      const doc = await Model.findByIdAndDelete(id);
      if (!doc) throw new ApiError(404, `${Model.modelName} not found`);
      return doc;
    },
  };
}

module.exports = { createCrudService };
