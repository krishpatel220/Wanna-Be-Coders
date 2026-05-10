const env = require('../config/env');
const AppError = require('../utils/AppError');

/**
 * Handle Mongoose CastError (invalid ObjectId, etc.)
 */
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

/**
 * Handle Mongoose duplicate key error (code 11000)
 */
const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const message = `Duplicate value for "${field}". Please use another value.`;
  return new AppError(message, 400);
};

/**
 * Handle Mongoose validation errors
 */
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

/**
 * Handle invalid JWT
 */
const handleJWTError = () =>
  new AppError('Invalid token. Please log in again.', 401);

/**
 * Handle expired JWT
 */
const handleJWTExpiredError = () =>
  new AppError('Your token has expired. Please log in again.', 401);

/**
 * Send detailed error response in development
 */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

/**
 * Send sanitized error response in production
 */
const sendErrorProd = (err, res) => {
  // Operational errors: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming / unknown errors: don't leak details
    console.error('💥 ERROR:', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

/**
 * Global error handling middleware.
 * Must be the LAST middleware registered in app.js.
 */
// eslint-disable-next-line no-unused-vars
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err, message: err.message, name: err.name };

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};

module.exports = globalErrorHandler;
