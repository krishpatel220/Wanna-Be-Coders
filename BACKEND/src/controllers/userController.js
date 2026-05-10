const User = require('../models/User');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { sendResponse, filterObj, getPagination } = require('../utils/helpers');

/**
 * GET /api/users/me
 * Get the currently authenticated user's profile.
 */
const getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new AppError('User not found.', 404));
  }

  sendResponse(res, 200, 'Profile retrieved successfully', { user });
});

/**
 * PATCH /api/users/me
 * Update the currently authenticated user's profile (non-sensitive fields only).
 */
const updateMe = catchAsync(async (req, res, next) => {
  // 1) Reject password updates via this route
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /api/auth/update-password.',
        400
      )
    );
  }

  // 2) Filter to only allowed fields
  const filteredBody = filterObj(req.body, 'name', 'email');

  // 3) Update user
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  sendResponse(res, 200, 'Profile updated successfully', { user: updatedUser });
});

/**
 * DELETE /api/users/me
 * Deactivate (soft-delete) the currently authenticated user's account.
 */
const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { isActive: false });

  // Clear auth cookie
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });

  sendResponse(res, 200, 'Account deactivated successfully');
});

// ─── Admin-only routes ─────────────────────────────────────────────────────────

/**
 * GET /api/users
 * Get all users (admin only). Supports pagination.
 */
const getAllUsers = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find().skip(skip).limit(limit).sort('-createdAt'),
    User.countDocuments(),
  ]);

  const pagination = getPagination(page, limit, total);

  sendResponse(res, 200, 'Users retrieved successfully', { users, pagination });
});

/**
 * GET /api/users/:id
 * Get a single user by ID (admin only).
 */
const getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('No user found with that ID.', 404));
  }

  sendResponse(res, 200, 'User retrieved successfully', { user });
});

/**
 * PATCH /api/users/:id
 * Update a user by ID (admin only).
 */
const updateUser = catchAsync(async (req, res, next) => {
  const filteredBody = filterObj(req.body, 'name', 'email', 'role', 'isActive');

  const user = await User.findByIdAndUpdate(req.params.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new AppError('No user found with that ID.', 404));
  }

  sendResponse(res, 200, 'User updated successfully', { user });
});

/**
 * DELETE /api/users/:id
 * Permanently delete a user by ID (admin only).
 */
const deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new AppError('No user found with that ID.', 404));
  }

  sendResponse(res, 204, 'User deleted successfully');
});

module.exports = {
  getMe,
  updateMe,
  deleteMe,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
};
