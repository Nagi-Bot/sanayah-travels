// Vercel serverless entry point
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// MongoDB connection - cache the promise for reuse
let mongoPromise = null;
let dbError = null;

function connectMongo() {
  if (!mongoPromise && process.env.MONGODB_URI) {
    mongoPromise = mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000
    });
    mongoPromise
      .then(() => { global.dbConnected = true; })
      .catch(err => { dbError = err.message; global.dbConnected = false; });
  }
  return mongoPromise;
}

connectMongo();

// DB status middleware (MUST be before routes)
app.use(async (req, res, next) => {
  if (mongoPromise && !global.dbConnected && !dbError) {
    try {
      await Promise.race([mongoPromise, new Promise(r => setTimeout(r, 8000))]);
    } catch(e) {}
  }
  req.dbConnected = !!global.dbConnected;
  next();
});

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

// MongoDB connection - cache the promise for reuse
let mongoPromise = null;
let dbError = null;

function connectMongo() {
  if (!mongoPromise && process.env.MONGODB_URI) {
    mongoPromise = mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000
    });
    mongoPromise
      .then(() => { global.dbConnected = true; })
      .catch(err => { dbError = err.message; global.dbConnected = false; });
  }
  return mongoPromise;
}

connectMongo();

app.get('/api/health', async (req, res) => {
  if (mongoPromise) {
    try {
      await Promise.race([
        mongoPromise,
        new Promise(r => setTimeout(r, 7000))
      ]);
    } catch(e) {}
  }
  res.json({ status: 'ok', timestamp: Date.now(), db: !!global.dbConnected });
});

module.exports = app;
