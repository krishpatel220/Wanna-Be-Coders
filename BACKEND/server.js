const app = require('./src/app');
const connectDB = require('./src/config/db');
const env = require('./src/config/env');

// ─── Handle uncaught exceptions (sync errors outside Express) ───────────────
process.on('uncaughtException', (err) => {
  console.error('💥 UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// ─── Connect to Database and Start Server ───────────────────────────────────
const startServer = async () => {
  await connectDB();

  const server = app.listen(env.PORT, () => {
    console.log(`
    ╔══════════════════════════════════════════════╗
    ║                                              ║
    ║   🚀 TravelLoop Server is running!           ║
    ║                                              ║
    ║   Environment : ${env.NODE_ENV.padEnd(25)}║
    ║   Port        : ${String(env.PORT).padEnd(25)}║
    ║   URL         : http://localhost:${String(env.PORT).padEnd(14)}║
    ║                                              ║
    ╚══════════════════════════════════════════════╝
    `);
  });

  // Handle unhandled promise rejections (e.g. DB connection lost)
  process.on('unhandledRejection', (err) => {
    console.error('💥 UNHANDLED REJECTION! Shutting down...');
    console.error(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });

  // Graceful shutdown on SIGTERM (e.g. Heroku, Docker, etc.)
  process.on('SIGTERM', () => {
    console.log('👋 SIGTERM received. Shutting down gracefully...');
    server.close(() => {
      console.log('🛑 Process terminated');
    });
  });
};

startServer();
