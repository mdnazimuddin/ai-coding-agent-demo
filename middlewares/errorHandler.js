/**
 * Global Error Handler Middleware
 * Centralizes error reporting and formats standardized error responses.
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || 'Internal Server Error';
  let details = err.details || null;

  // Handle Mongoose CastError (e.g. invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid format for field '${err.path}'`;
    details = `Cast to ${err.kind} failed for value '${err.value}' at path '${err.path}'`;
  }

  // Handle Mongoose MongoServerError Duplicate Key (E11000)
  if (err.code === 11000 || (err.name === 'MongoServerError' && err.code === 11000)) {
    statusCode = 409;
    message = 'Resource already exists';
    const duplicateKeys = err.keyValue ? Object.keys(err.keyValue) : [];
    details = duplicateKeys.length > 0
      ? `Duplicate value for field(s): ${duplicateKeys.join(', ')}`
      : 'A resource with the specified unique field already exists';
  }

  // Handle Mongoose Validation Errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    if (err.errors) {
      details = Object.values(err.errors).map((error) => error.message);
    } else {
      details = err.message;
    }
  }

  // Untrapped / Default Server Errors
  if (statusCode === 500) {
    message = err.message && process.env.NODE_ENV !== 'production' ? err.message : 'Internal Server Error';
    if (!details) {
      details = process.env.NODE_ENV === 'production' ? 'An unexpected error occurred on the server' : (err.stack || 'Internal Server Error');
    }
  }

  if (!details) {
    details = message;
  }

  return res.status(statusCode).json({
    success: false,
    message: message,
    error: {
      code: statusCode,
      details: details
    }
  });
};

module.exports = errorHandler;
