/**
 * Custom application error class.
 * Extends the native Error with an HTTP status code and operational flag.
 * Operational errors are expected (e.g. bad input); programming errors are not.
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
