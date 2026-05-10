const express = require('express');
const {
  getMe,
  updateMe,
  deleteMe,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// All routes below require authentication
router.use(protect);

// ─── Current user (self-service) ────────────────────────────────────────────
router.route('/me').get(getMe).patch(updateMe).delete(deleteMe);

// ─── Admin-only routes ─────────────────────────────────────────────────────
router.use(restrictTo('admin'));

router.route('/').get(getAllUsers);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
