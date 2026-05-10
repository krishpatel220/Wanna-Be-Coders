const Trip = require('../models/Trip');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { sendResponse, getPagination } = require('../utils/helpers');

/**
 * GET /api/trips
 * Get all trips for the current user.
 */
const getMyTrips = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const skip = (page - 1) * limit;

  const [trips, total] = await Promise.all([
    Trip.find({ user: req.user.id }).skip(skip).limit(limit).sort('-createdAt'),
    Trip.countDocuments({ user: req.user.id }),
  ]);

  const pagination = getPagination(page, limit, total);

  sendResponse(res, 200, 'Trips retrieved successfully', { trips, pagination });
});

/**
 * GET /api/trips/:id
 * Get a single trip by ID (must belong to the user).
 */
const getTrip = catchAsync(async (req, res, next) => {
  const trip = await Trip.findOne({ _id: req.params.id, user: req.user.id });

  if (!trip) {
    return next(new AppError('No trip found with that ID.', 404));
  }

  sendResponse(res, 200, 'Trip retrieved successfully', { trip });
});

/**
 * POST /api/trips
 * Create a new trip.
 */
const createTrip = catchAsync(async (req, res) => {
  const { title, destinations, activities, startDate, endDate, totalBudget, notes } = req.body;

  const trip = await Trip.create({
    title,
    user: req.user.id,
    destinations: destinations || [],
    activities: activities || [],
    startDate,
    endDate,
    totalBudget: totalBudget || 0,
    notes: notes || '',
  });

  sendResponse(res, 201, 'Trip created successfully', { trip });
});

/**
 * PATCH /api/trips/:id
 * Update a trip.
 */
const updateTrip = catchAsync(async (req, res, next) => {
  const trip = await Trip.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!trip) {
    return next(new AppError('No trip found with that ID.', 404));
  }

  sendResponse(res, 200, 'Trip updated successfully', { trip });
});

/**
 * DELETE /api/trips/:id
 * Delete a trip.
 */
const deleteTrip = catchAsync(async (req, res, next) => {
  const trip = await Trip.findOneAndDelete({ _id: req.params.id, user: req.user.id });

  if (!trip) {
    return next(new AppError('No trip found with that ID.', 404));
  }

  sendResponse(res, 204, 'Trip deleted successfully');
});

module.exports = { getMyTrips, getTrip, createTrip, updateTrip, deleteTrip };
