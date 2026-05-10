const AppError = require('../utils/AppError');

/**
 * Simple in-memory rate limiter.
 * Tracks request counts per IP within a sliding time window.
 *
 * For production at scale, replace this with redis-based rate limiting
 * (e.g. express-rate-limit with rate-limit-redis store).
 *
 * @param {object} options
 * @param {number} options.windowMs - Time window in milliseconds (default: 15 min)
 * @param {number} options.max - Max requests per window per IP (default: 100)
 * @param {string} options.message - Error message when limit is exceeded
 * @returns {Function} Express middleware
 */
const rateLimiter = ({
  windowMs = 15 * 60 * 1000,
  max = 100,
  message = 'Too many requests from this IP, please try again later.',
} = {}) => {
  const requests = new Map();

  // Periodically clean up expired entries
  const cleanup = setInterval(() => {
    const now = Date.now();
    for (const [key, data] of requests) {
      if (now - data.startTime > windowMs) {
        requests.delete(key);
      }
    }
  }, windowMs);

  // Don't prevent Node from exiting
  cleanup.unref();

  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();

    if (!requests.has(ip)) {
      requests.set(ip, { count: 1, startTime: now });
      return next();
    }

    const record = requests.get(ip);

    // Reset window if it has expired
    if (now - record.startTime > windowMs) {
      record.count = 1;
      record.startTime = now;
      return next();
    }

    record.count += 1;

    if (record.count > max) {
      // Set Retry-After header
      const retryAfterSeconds = Math.ceil(
        (record.startTime + windowMs - now) / 1000
      );
      res.set('Retry-After', String(retryAfterSeconds));
      return next(new AppError(message, 429));
    }

    next();
  };
};

module.exports = rateLimiter;
