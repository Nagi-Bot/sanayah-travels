require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();

// Rate limiting (skip on Vercel serverless)
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
if (process.env.VERCEL !== '1') {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: { error: 'Too many requests, please try again later.' }
  });
  app.use('/api/', limiter);
}

// Make db status available to routes
app.use((req, res, next) => {
  req.dbConnected = global.dbConnected;
  next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/visitors', require('./routes/visitors'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/airlines', require('./routes/airlines'));
app.use('/api/blog', require('./routes/blog'));
app.use('/api/faq', require('./routes/faq'));
app.use('/api/qa', require('./routes/qa'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/pages', require('./routes/pages'));
app.use('/api/chatbot', require('./routes/chatbot'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// Serve static frontend (local dev only - on Vercel static files are served by Vercel)
if (process.env.VERCEL !== '1') {
  app.use(express.static(path.join(__dirname, '..')));
}

// MongoDB connection (with timeout)
const mongooseConnect = mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sanayah', {
  serverSelectionTimeoutMS: 8000,
  connectTimeoutMS: 8000
})
  .then(() => {
    console.log('MongoDB connected');
    global.dbConnected = true;
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    console.log('Server running without database - frontend uses localStorage fallback');
    global.dbConnected = false;
  });

// Only listen when running directly (not imported by Vercel)
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sanayah API running on port ${PORT}`);
  });
}

module.exports = app;
