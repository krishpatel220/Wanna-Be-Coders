const express = require('express');
const {
  register,
  login,
  logout,
  updatePassword,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const {
  validateRegister,
  validateLogin,
  validateUpdatePassword,
} = require('../validators/authValidator');
const rateLimiter = require('../middleware/rateLimitMiddleware');

const router = express.Router();

// Rate-limit auth routes more aggressively to prevent brute-force attacks
const authLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,                   // 20 attempts per window
  message: 'Too many authentication attempts, please try again after 15 minutes.',
});

// Public routes
router.post('/register', authLimiter, validate(validateRegister), register);
router.post('/login', authLimiter, validate(validateLogin), login);

// Protected routes (must be logged in)
router.post('/logout', protect, logout);
router.patch(
  '/update-password',
  protect,
  validate(validateUpdatePassword),
  updatePassword
);

module.exports = router;
