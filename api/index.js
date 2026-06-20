// Vercel serverless entry point
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Import all route handlers
app.use('/api/auth', require('../server/routes/auth'));
app.use('/api/reviews', require('../server/routes/reviews'));
app.use('/api/visitors', require('../server/routes/visitors'));
app.use('/api/contact', require('../server/routes/contact'));
app.use('/api/airlines', require('../server/routes/airlines'));
app.use('/api/blog', require('../server/routes/blog'));
app.use('/api/faq', require('../server/routes/faq'));
app.use('/api/qa', require('../server/routes/qa'));
app.use('/api/settings', require('../server/routes/settings'));
app.use('/api/pages', require('../server/routes/pages'));
app.use('/api/chatbot', require('../server/routes/chatbot'));

// DB status
app.use((req, res, next) => {
  req.dbConnected = global.dbConnected;
  next();
});

let dbError = null;

// Connect to MongoDB (async, won't block)
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000
  })
    .then(() => { global.dbConnected = true; console.log('MongoDB connected'); })
    .catch(err => { global.dbConnected = false; dbError = err.message; console.error('MongoDB error:', err.message); });
} else {
  console.log('MONGODB_URI not set');
}

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: Date.now(),
    db: !!global.dbConnected,
    dbError: dbError,
    hasMongoUri: !!process.env.MONGODB_URI
  });
});

module.exports = app;
