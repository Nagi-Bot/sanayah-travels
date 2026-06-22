// Single entry point for Vercel - serves both API and static files
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
let dbConnected = false;
function connectMongo() {
  if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 8000, connectTimeoutMS: 8000 })
      .then(() => { dbConnected = true; global.dbConnected = true; })
      .catch(() => { dbConnected = false; global.dbConnected = false; });
  }
}
connectMongo();

// DB middleware
app.use((req, res, next) => {
  req.dbConnected = dbConnected;
  next();
});

// API routes
const routeFiles = ['auth','reviews','visitors','contact','airlines','blog','faq','qa','settings','pages','chatbot'];
routeFiles.forEach(function(r) {
  try {
    app.use('/api/' + r, require('./server/routes/' + r));
  } catch(e) { console.error('Route load error: ' + r, e.message); }
});

// Health endpoint
app.get('/api/health', function(req, res) {
  res.json({ status: 'ok', timestamp: Date.now(), db: dbConnected });
});

// Serve static files
app.use(express.static(__dirname));

// Catch-all for SPA client-side routing (serve index.html for unknown routes)
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

module.exports = app;
