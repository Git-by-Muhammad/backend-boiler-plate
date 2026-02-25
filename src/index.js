require('dotenv').config();
const http = require('http');
const app = require('./config/app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Start server after DB connection
async function start() {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

start();

