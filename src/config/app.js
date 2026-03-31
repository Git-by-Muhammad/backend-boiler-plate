const path = require('path');
const express = require('express');
const cors = require('cors');

const routes = require('../routes');
const notFound = require('../middleware/notFound');
const errorHandler = require('../middleware/errorHandler');
const requestLogger = require('../middleware/requestLogger');

const app = express();

app.use(cors());
app.use(requestLogger);
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api/v1', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;


