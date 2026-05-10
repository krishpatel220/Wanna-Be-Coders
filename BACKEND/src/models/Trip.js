const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Trip title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Trip must belong to a user'],
    },
    destinations: [
      {
        name: String,
        country: String,
        lat: Number,
        lng: Number,
        image: String,
        budgetEstimate: Number,
      },
    ],
    activities: [
      {
        destinationName: String,
        activityName: String,
        cost: Number,
        duration: String,
      },
    ],
    startDate: Date,
    endDate: Date,
    status: {
      type: String,
      enum: ['upcoming', 'active', 'completed'],
      default: 'upcoming',
    },
    totalBudget: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for user's trips
tripSchema.index({ user: 1, createdAt: -1 });

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;
