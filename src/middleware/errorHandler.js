const errorHandler = (err, req, res, next) => {
  console.error(err);
  let statusCode = err.statusCode || 500;
  if (err.code && err.code.startsWith('LIMIT_')) statusCode = 400;
  res.status(statusCode).json({
    message: err.message || 'Internal server error',
  });
};

module.exports = errorHandler;
