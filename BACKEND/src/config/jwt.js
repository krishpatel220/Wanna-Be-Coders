const jwt = require('jsonwebtoken');
const env = require('./env');

/**
 * Generate a JWT access token for a given user ID.
 * @param {string} userId - The user's MongoDB _id
 * @returns {string} Signed JWT token
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

/**
 * Verify and decode a JWT token.
 * @param {string} token - The JWT token string
 * @returns {object} Decoded token payload
 */
const verifyToken = (token) => {
  return jwt.verify(token, env.JWT_SECRET);
};

/**
 * Attach a JWT as an httpOnly cookie on the response.
 * @param {object} res - Express response object
 * @param {string} token - The JWT token
 */
const sendTokenCookie = (res, token) => {
  const cookieOptions = {
    expires: new Date(
      Date.now() + env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
  };

  res.cookie('jwt', token, cookieOptions);
};

module.exports = { generateToken, verifyToken, sendTokenCookie };
