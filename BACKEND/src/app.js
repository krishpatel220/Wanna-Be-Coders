const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const env = require('./config/env');
const globalErrorHandler = require('./middleware/errorMiddleware');
const rateLimiter = require('./middleware/rateLimitMiddleware');
const AppError = require('./utils/AppError');

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const tripRoutes = require('./routes/tripRoutes');

const app = express();

// ─── Global Middleware ──────────────────────────────────────────────────────

// Security headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);

// Global rate limiter (100 requests per 15 min per IP)
app.use(
  '/api',
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

// Request logging (dev only)
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parsers
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Cookie parser
app.use(cookieParser());

// ─── Health Check ───────────────────────────────────────────────────────────

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ─────────────────────────────────────────────────────────────

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/trips', tripRoutes);

// ─── 404 Handler ────────────────────────────────────────────────────────────

app.all('{*path}', (req, res, next) => {
  next(new AppError(`Cannot find ${req.method} ${req.originalUrl} on this server`, 404));
});

// ─── Global Error Handler ───────────────────────────────────────────────────

app.use(globalErrorHandler);

module.exports = app;
