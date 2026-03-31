const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

const routes = require('../routes');
const docsRouter = require('../routes/docs.routes');
const notFound = require('../middleware/notFound');
const errorHandler = require('../middleware/errorHandler');
const requestLogger = require('../middleware/requestLogger');
const { apiLimiter, authLimiter } = require('../middleware/rateLimiter');
const correlationId = require('../middleware/correlationId');
const auditLogger = require('../middleware/auditLogger');

const app = express();

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(correlationId);
app.use(requestLogger);
app.use(auditLogger);
app.use(express.json());
app.use('/api/v1', apiLimiter);
app.use('/api/v1/auth', authLimiter);
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/api/v1/docs', docsRouter);

app.use('/api/v1', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;


