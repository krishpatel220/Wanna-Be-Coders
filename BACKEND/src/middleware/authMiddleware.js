const { verifyToken } = require('../config/jwt');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

/**
 * Middleware: Protect routes — ensures the request has a valid JWT.
 * Attaches the authenticated user to req.user.
 */
const protect = catchAsync(async (req, res, next) => {
  let token;

  // 1) Extract token from Authorization header or cookie
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('You are not logged in. Please log in to get access.', 401)
    );
  }

  // 2) Verify the token
  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid token. Please log in again.', 401));
    }
    if (err.name === 'TokenExpiredError') {
      return next(
        new AppError('Your token has expired. Please log in again.', 401)
      );
    }
    return next(new AppError('Authentication failed.', 401));
  }

  // 3) Check if the user still exists
  const currentUser = await User.findById(decoded.id).select('+password');
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token no longer exists.', 401)
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password. Please log in again.', 401)
    );
  }

  // 5) Grant access — attach user to request
  req.user = currentUser;
  next();
});

/**
 * Middleware: Restrict access to specific roles.
 * Must be used AFTER the protect middleware.
 *
 * Usage: restrictTo('admin', 'moderator')
 */
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action.', 403)
      );
    }
    next();
  };
};

module.exports = { protect, restrictTo };
