const path = require('path');
const fs = require('fs');
const multer = require('multer');

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
const MAX_FILE_SIZE = 100 * 1024 * 1024;
const ALLOWED_IMAGE = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_VIDEO = ['video/mp4', 'video/webm', 'video/quicktime'];
const ALLOWED_ASSETS = ['application/pdf', 'application/zip', 'application/x-rar-compressed'];

const allAllowed = [...ALLOWED_IMAGE, ...ALLOWED_VIDEO, ...ALLOWED_ASSETS];

if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const sub = file.mimetype.startsWith('image/') ? 'images' : file.mimetype.startsWith('video/') ? 'videos' : 'assets';
    const dir = path.join(UPLOAD_DIR, sub);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || path.extname(path.basename(file.originalname, path.extname(file.originalname))) || '';
    const safe = Buffer.from(file.originalname, 'latin1').toString('utf8').replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '') || 'file';
    const name = `${Date.now()}-${safe.slice(0, 50)}${ext}`;
    cb(null, name);
  },
});

const fileFilter = (req, file, cb) => {
  if (allAllowed.includes(file.mimetype)) return cb(null, true);
  cb(new Error(`File type not allowed: ${file.mimetype}`));
};

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

const uploadSingle = (fieldName = 'file') => upload.single(fieldName);
const uploadMultiple = (fieldName = 'files', maxCount = 10) => upload.array(fieldName, maxCount);
const uploadFields = (fields) => upload.fields(fields);

module.exports = {
  upload,
  uploadSingle,
  uploadMultiple,
  uploadFields,
  UPLOAD_DIR,
  ALLOWED_IMAGE,
  ALLOWED_VIDEO,
  ALLOWED_ASSETS,
};
