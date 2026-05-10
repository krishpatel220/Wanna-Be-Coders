const express = require('express');
const {
  getMyTrips,
  getTrip,
  createTrip,
  updateTrip,
  deleteTrip,
} = require('../controllers/tripController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All trip routes require authentication
router.use(protect);

router.route('/').get(getMyTrips).post(createTrip);
router.route('/:id').get(getTrip).patch(updateTrip).delete(deleteTrip);

module.exports = router;
