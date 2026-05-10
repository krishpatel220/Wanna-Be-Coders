const AppError = require('../utils/AppError');

/**
 * Middleware factory: Validates request body/query/params against a schema.
 * Uses a simple validation approach without external libraries.
 *
 * @param {Function} validationFn - A function that receives the data and returns
 *   { isValid: boolean, errors: string[] }
 * @param {string} source - Where to read data from: 'body', 'query', or 'params'
 * @returns {Function} Express middleware
 */
const validate = (validationFn, source = 'body') => {
  return (req, res, next) => {
    const data = req[source];
    const { isValid, errors } = validationFn(data);

    if (!isValid) {
      return next(
        new AppError(`Validation failed: ${errors.join('. ')}`, 400)
      );
    }

    next();
  };
};

module.exports = validate;
