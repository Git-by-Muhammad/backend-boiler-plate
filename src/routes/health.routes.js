const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend boilerplate is running',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;


