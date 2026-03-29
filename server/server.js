const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const app = require('./src/app');

const PORT = process.env.PORT || 5000;
const DB = process.env.MONGODB_URI;

// 🔥 Handle uncaught exceptions
process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

// ✅ CONNECT DB FIRST
mongoose.connect(DB)
  .then(() => {
    console.log('✅ DB connection successful!');

    // ✅ START SERVER AFTER DB CONNECTS
    const server = app.listen(PORT, () => {
      console.log(`🚀 App running on port ${PORT}...`);
    });

    // 🔥 Handle unhandled promise rejections
    process.on('unhandledRejection', err => {
      console.log('UNHANDLED REJECTION! 💥 Shutting down...');
      console.log(err.name, err.message);
      server.close(() => {
        process.exit(1);
      });
    });

  })
  .catch((err) => {
    console.error('❌ DB connection error:', err);
  });