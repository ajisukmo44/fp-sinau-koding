# Express.js API

A simple Express.js API with routing and middleware.

## Project Structure

```
.
├── app.js              # Express app configuration
├── server.js           # Entry point
├── package.json        # Project dependencies
├── middleware/         # Custom middleware
│   ├── errorHandler.js # Error handling middleware
│   └── requestLogger.js # Request logging middleware
└── routes/             # API routes
    ├── users.js        # User routes
    └── products.js     # Product routes
```

## Installation

```bash
npm install
```

## Running the Server

```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

## API Endpoints

### Users
- GET /api/users - Get all users
- GET /api/users/:id - Get user by ID
- POST /api/users - Create a new user
- PUT /api/users/:id - Update a user
- DELETE /api/users/:id - Delete a user

### Products
- GET /api/products - Get all products
- GET /api/products/:id - Get product by ID
- POST /api/products - Create a new product
- PUT /api/products/:id - Update a product
- DELETE /api/products/:id - Delete a product