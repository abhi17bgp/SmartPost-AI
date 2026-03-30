const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL ? ['http://localhost:5173', process.env.FRONTEND_URL] : ['http://localhost:5173'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routes/authRoutes');
const workspaceRouter = require('./routes/workspaceRoutes');
const collectionRouter = require('./routes/collectionRoutes');
const requestRouter = require('./routes/requestRoutes');
const historyRouter = require('./routes/historyRoutes');
const aiRouter = require('./routes/aiRoutes');

// Routes
app.use('/api/auth', authRouter);
app.use('/api/workspaces', workspaceRouter);
app.use('/api/collections', collectionRouter);
app.use('/api/requests', requestRouter);
app.use('/api/history', historyRouter);
app.use('/api/ai', aiRouter);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'API is running' });
});

const proxyController = require('./controllers/proxyController');
const authController = require('./controllers/authController');

// Proxy route for bypassing CORS in API tool
app.post('/api/proxy', authController.protect, proxyController.proxyRequest);

// Catch-all unhandled routes
app.use((req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

module.exports = app;
