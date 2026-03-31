const ApiError = require('../utils/ApiError');

const validate = (schemaMap) => (req, res, next) => {
  try {
    const map = schemaMap || {};
    const sources = ['body', 'params', 'query'];

    for (const source of sources) {
      if (!map[source]) continue;
      const { error, value } = map[source].validate(req[source], {
        abortEarly: false,
        stripUnknown: true,
      });
      if (error) {
        return next(new ApiError(400, error.details.map((d) => d.message).join(', ')));
      }
      req[source] = value;
    }

    return next();
  } catch (err) {
    return next(err);
  }
};

module.exports = validate;

