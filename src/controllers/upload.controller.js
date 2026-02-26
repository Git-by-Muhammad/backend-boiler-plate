const path = require('path');
const asyncHandler = require('../utils/asyncHandler');

const toPublicPath = (filePath) => {
  const normalized = path.normalize(filePath).replace(/\\/g, '/');
  const uploadsIdx = normalized.indexOf('uploads/');
  return uploadsIdx >= 0 ? `/uploads/${normalized.slice(normalized.indexOf('uploads/') + 8)}` : normalized;
};

const single = asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const filePath = req.file.path || path.join(req.file.destination, req.file.filename);
  const url = toPublicPath(filePath);
  res.status(201).json({ url, path: filePath, filename: req.file.filename, mimetype: req.file.mimetype, size: req.file.size });
});

const multiple = asyncHandler(async (req, res) => {
  const files = (req.files || []).map((f) => {
    const filePath = f.path || path.join(f.destination, f.filename);
    return {
    url: toPublicPath(filePath),
    path: filePath,
    filename: f.filename,
    mimetype: f.mimetype,
    size: f.size,
  };
  });
  res.status(201).json({ files, count: files.length });
});

module.exports = { single, multiple };
