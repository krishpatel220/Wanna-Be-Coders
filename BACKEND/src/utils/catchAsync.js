/**
 * Wraps an async Express route handler to automatically catch errors
 * and forward them to the global error middleware via next().
 *
 * Usage: router.get('/route', catchAsync(async (req, res, next) => { ... }));
 *
 * @param {Function} fn - Async route handler function
 * @returns {Function} Express middleware
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = catchAsync;
