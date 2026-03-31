const stripSensitiveFields = (value, sensitive = ['passwordHash']) => {
  if (Array.isArray(value)) {
    return value.map((item) => stripSensitiveFields(item, sensitive));
  }

  if (value && typeof value === 'object') {
    const plain = typeof value.toObject === 'function' ? value.toObject() : { ...value };
    for (const field of sensitive) {
      delete plain[field];
    }
    for (const key of Object.keys(plain)) {
      plain[key] = stripSensitiveFields(plain[key], sensitive);
    }
    return plain;
  }

  return value;
};

const sanitizeUser = (user) => {
  if (!user) return user;
  const plain = typeof user.toObject === 'function' ? user.toObject() : { ...user };
  delete plain.passwordHash;
  return plain;
};

module.exports = { stripSensitiveFields, sanitizeUser };

