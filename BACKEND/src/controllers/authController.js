const User = require('../models/User');
const { generateToken, sendTokenCookie } = require('../config/jwt');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { sendResponse } = require('../utils/helpers');
const { sendWelcomeEmail } = require('../services/emailService');

/**
 * Helper: Create token, set cookie, and send JSON response.
 */
const createAndSendToken = (user, statusCode, message, res) => {
  const token = generateToken(user._id);
  sendTokenCookie(res, token);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    message,
    token,
    data: { user },
  });
};

/**
 * POST /api/auth/register
 * Register a new user account.
 */
const register = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('A user with this email already exists.', 400));
  }

  // Create user (only allow safe fields — never pass role from req.body)
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
  });

  // Send welcome email (non-blocking)
  sendWelcomeEmail(newUser).catch((err) =>
    console.error('Failed to send welcome email:', err.message)
  );

  createAndSendToken(newUser, 201, 'Account created successfully', res);
});

/**
 * POST /api/auth/login
 * Authenticate and log in a user.
 */
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password.', 400));
  }

  // 2) Find user and explicitly select password
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Incorrect email or password.', 401));
  }

  // 3) Send token
  createAndSendToken(user, 200, 'Logged in successfully', res);
});

/**
 * POST /api/auth/logout
 * Clear the JWT cookie to log out.
 */
const logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 5 * 1000), // expires in 5 seconds
    httpOnly: true,
  });

  sendResponse(res, 200, 'Logged out successfully');
};

/**
 * PATCH /api/auth/update-password
 * Update the current user's password (must be logged in).
 */
const updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  // 1) Get user with password
  const user = await User.findById(req.user.id).select('+password');

  // 2) Verify current password
  if (!(await user.comparePassword(currentPassword))) {
    return next(new AppError('Your current password is incorrect.', 401));
  }

  // 3) Update password
  user.password = newPassword;
  await user.save();

  // 4) Issue new token
  createAndSendToken(user, 200, 'Password updated successfully', res);
});

module.exports = { register, login, logout, updatePassword };
