## MERN Backend Boilerplate

Modular Node.js/Express/MongoDB backend with generic CRUD and file upload (Multer). Scalable, component-based structure.

### Tech Stack

- **Runtime**: Node.js (CommonJS)
- **Framework**: Express 5
- **Database**: MongoDB with Mongoose
- **Uploads**: Multer (images, video, assets)
- **Env & Utilities**: dotenv, cors, nodemon (dev)

### Getting Started

1. **Install**: `npm install`
2. **Env**: Copy `.env.example` to `.env`, set `PORT` and `MONGO_URI`
3. **Run**: `npm run dev` (nodemon) or `npm start`

### Project Structure

```
src/
  index.js                 # Entry: DB connect, HTTP server
  config/
    app.js                 # Express app, static uploads, routes, error middleware
    db.js                  # Mongoose connection
    multer.js              # Multer storage, limits, fileFilter (image/video/assets)
  routes/
    index.js               # Aggregates all API routes under /api
    health.routes.js
    upload.routes.js       # POST /api/upload/single, /api/upload/multiple
    crud.routes.js         # Factory: createCrudRoutes(Model) -> router
  controllers/
    crud.controller.js     # Factory: createCrudController(service) -> CRUD handlers
    upload.controller.js   # Single/multiple upload responses (url, path, mimetype, size)
  services/
    crud.service.js        # Factory: createCrudService(Model) -> create, getById, getAll, update, remove
  middleware/
    errorHandler.js        # Central error handler (statusCode, message)
    notFound.js            # 404
  utils/
    ApiError.js            # Error with statusCode
    asyncHandler.js        # Wraps async route handlers, forwards errors
  models/                  # Mongoose models (e.g. item.model.js)
  modules/                 # Feature modules (e.g. items = model + CRUD routes)
    items/
      index.js
      items.routes.js      # Mounts createCrudRoutes(Item) at /api/items
  uploads/                 # Created at runtime: images/, videos/, assets/
```

### API Endpoints

- **Health**: `GET /api/health` → `{ status, message, timestamp }`
- **Upload single**: `POST /api/upload/single` (field: `file`) → `{ url, path, filename, mimetype, size }`
- **Upload multiple**: `POST /api/upload/multiple` (field: `files`, max 20) → `{ files[], count }`
- **Items CRUD (example)**:
  - `POST /api/items` — create
  - `GET /api/items` — list (query: `page`, `limit`, `sort`, any model fields to filter)
  - `GET /api/items/:id` — get one
  - `PATCH /api/items/:id` or `PUT /api/items/:id` — update
  - `DELETE /api/items/:id` — delete

Uploaded files are stored under `uploads/images`, `uploads/videos`, or `uploads/assets` and served at `/uploads/...`. Max file size 100MB. Allowed types: JPEG/PNG/GIF/WebP, MP4/WebM/QuickTime, PDF/ZIP/RAR.

### Adding a New Resource (CRUD)

1. Create a model in `src/models/` (e.g. `product.model.js`).
2. Create a module in `src/modules/` (e.g. `products/index.js` and `products/products.routes.js`).
3. In `products.routes.js`: `router.use('/', createCrudRoutes(Product));`
4. In `src/routes/index.js`: `router.use('/products', require('../modules/products'));`

### Adding Upload to a Route

Use multer from `src/config/multer.js`:

- `uploadSingle('fieldName')` — one file
- `uploadMultiple('fieldName', maxCount)` — many files
- `uploadFields([{ name: 'avatar', maxCount: 1 }, { name: 'gallery', maxCount: 10 }])`

Then in the route handler use `req.file` or `req.files` and optionally save URLs to your model.

### Reusable Pieces

- **CRUD**: `createCrudService(Model)` + `createCrudController(service)` + `createCrudRoutes(Model)` — no boilerplate per resource.
- **Errors**: Throw `new ApiError(404, 'Not found')`; use `asyncHandler` on async route handlers so errors go to `errorHandler`.
- **Upload**: Same multer config and controller for any route; adjust field names and limits as needed.
