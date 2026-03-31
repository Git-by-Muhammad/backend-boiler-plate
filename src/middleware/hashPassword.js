const bcrypt = require('bcryptjs');

const hashPasswordIfPresent = async (req, res, next) => {
  try {
    if (!req.body.password) return next();
    const salt = await bcrypt.genSalt(10);
    req.body.passwordHash = await bcrypt.hash(req.body.password, salt);
    delete req.body.password;
    return next();
  } catch (err) {
    return next(err);
  }
};

module.exports = { hashPasswordIfPresent };

