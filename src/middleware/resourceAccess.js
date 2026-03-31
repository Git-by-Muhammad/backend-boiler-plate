const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

const assignOwnerOnCreate = (ownerField) => (req, res, next) => {
  if (!req.user?.id) return next(new ApiError(401, 'Authentication required'));
  req.body[ownerField] = req.user.id;
  next();
};

const scopeQueryToOwner = (ownerField) => (req, res, next) => {
  if (!req.user?.id) return next(new ApiError(401, 'Authentication required'));
  if (req.user.role !== 'admin') {
    req.query[ownerField] = req.user.id;
  }
  next();
};

const adminOrOwner = (Model, ownerField) =>
  asyncHandler(async (req, res, next) => {
    if (!req.user?.id) throw new ApiError(401, 'Authentication required');
    if (req.user.role === 'admin') return next();

    const doc = await Model.findById(req.params.id).select(ownerField).lean();
    if (!doc) throw new ApiError(404, `${Model.modelName} not found`);

    if (String(doc[ownerField]) !== String(req.user.id)) {
      throw new ApiError(403, 'Forbidden');
    }
    return next();
  });

module.exports = { assignOwnerOnCreate, scopeQueryToOwner, adminOrOwner };

