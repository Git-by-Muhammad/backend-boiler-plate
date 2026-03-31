require('dotenv').config();
const http = require('http');
const app = require('./config/app');
const connectDB = require('./config/db');
const env = require('./config/env');
const logger = require('./utils/logger');

const server = http.createServer(app);

async function start() {
  try {
    await connectDB();
    server.listen(env.port, () => {
      logger.info(`Server running on port ${env.port}`);
    });
  } catch (err) {
    logger.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

start();

