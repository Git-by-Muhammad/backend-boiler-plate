const express = require('express');
const { uploadSingle, uploadMultiple } = require('../config/multer');
const { single, multiple } = require('../controllers/upload.controller');

const router = express.Router();

router.post('/single', uploadSingle('file'), single);
router.post('/multiple', uploadMultiple('files', 20), multiple);

module.exports = router;
