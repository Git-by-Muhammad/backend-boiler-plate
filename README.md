## MERN Backend Boilerplate

A minimal Node.js/Express/MongoDB backend starter for MERN applications.

### Tech Stack

- **Runtime**: Node.js (CommonJS)
- **Framework**: Express
- **Database**: MongoDB with Mongoose
- **Env & Utilities**: dotenv, cors, nodemon (dev)

### Getting Started

#### 1. Install dependencies

```bash
npm install
```

#### 2. Environment variables

Create a `.env` file in the project root:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/your_database_name
```

Make sure MongoDB is running locally or use a MongoDB Atlas connection string.

#### 3. Available scripts

```bash
npm start   # start server with node
npm run dev # start server with nodemon (auto-restart)
```

### Project Structure

```text
backend-boiler-plate/
  package.json
  src/
    index.js          # server entry, loads env, connects DB, starts HTTP server
    config/
      app.js          # Express app configuration, middlewares, routes
      db.js           # MongoDB connection helper (Mongoose)
    routes/
      health.routes.js # health check route
    models/           # (add your Mongoose models here)
    middleware/       # (add custom middleware here)
    utils/            # (add utility/helper functions here)
```

### API Endpoints

- **Health Check**
  - **GET** `/api/health`
  - **Response example**:

```json
{
  "status": "ok",
  "message": "Backend boilerplate is running",
  "timestamp": "2026-02-25T12:34:56.000Z"
}
```

### Next Steps

- Add your first Mongoose model in `src/models`
- Create feature routes in `src/routes` and mount them in `src/config/app.js`
- Add authentication, validation, logging, etc., as needed for your app


