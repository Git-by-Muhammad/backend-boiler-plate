const express = require('express');
const adminUsersRouter = require('./users.routes');
const profileRouter = require('./profile.routes');

const router = express.Router();

router.use('/', adminUsersRouter);
router.use('/', profileRouter);

module.exports = router;

