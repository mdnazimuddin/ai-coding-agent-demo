const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Helper to safely require candidate module paths
const loadCandidate = (candidates) => {
  for (const candidate of candidates) {
    try {
      return require(candidate);
    } catch (err) {
      if (err.code !== 'MODULE_NOT_FOUND') {
        throw err;
      }
    }
  }
  return null;
};

// Database Connector
const dbModule = loadCandidate([
  './config/db',
  './src/config/db',
  './config/database',
  './src/config/database'
]);

const connectDB = typeof dbModule === 'function'
  ? dbModule
  : (dbModule && dbModule.connectDB ? dbModule.connectDB : async () => {
      const mongoose = require('mongoose');
      const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/simple-crud';
      const conn = await mongoose.connect(uri);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    });

// Routing Tree
const userRoutesModule = loadCandidate([
  './routes/userRoutes',
  './src/routes/userRoutes',
  './routes/user.routes',
  './src/routes/user.routes',
  './routes/users',
  './src/routes/users'
]);

const userRoutes = userRoutesModule && (userRoutesModule.default || userRoutesModule.userRoutes || userRoutesModule.router || userRoutesModule);

// Error Handlers
const errorModule = loadCandidate([
  './middlewares/errorHandler',
  './src/middlewares/errorHandler',
  './middleware/errorHandler',
  './src/middleware/errorHandler',
  './middlewares/errorMiddleware',
  './src/middlewares/errorMiddleware',
  './middleware/errorMiddleware',
  './src/middleware/errorMiddleware'
]);

let customErrorHandler = null;
let customNotFoundHandler = null;

if (typeof errorModule === 'function') {
  customErrorHandler = errorModule;
} else if (errorModule) {
  customErrorHandler = errorModule.errorHandler || errorModule.default;
  customNotFoundHandler = errorModule.notFound || errorModule.notFoundHandler;
}

// Initialize Express
const app = express();

// Connect Database
if (typeof connectDB === 'function') {
  connectDB();
}

// Global top-level middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
});

// Mount routing
const apiPrefix = process.env.API_PREFIX || '/api/v1';
if (userRoutes) {
  app.use(`${apiPrefix}/users`, userRoutes);
}

// Unhandled 404 routes catch-all
if (customNotFoundHandler) {
  app.use(customNotFoundHandler);
} else {
  app.use((req, res, next) => {
    res.status(404).json({
      success: false,
      message: `Route not found: ${req.method} ${req.originalUrl}`
    });
  });
}

// Terminating global error handler middleware
if (customErrorHandler) {
  app.use(customErrorHandler);
} else {
  app.use((err, req, res, next) => {
    const statusCode = err.statusCode || (res.statusCode && res.statusCode !== 200 ? res.statusCode : 500);
    res.status(statusCode).json({
      success: false,
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  });
}

// Configure app.listen
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
});

module.exports = app;
module.exports.server = server;
