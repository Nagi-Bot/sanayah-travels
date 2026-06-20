const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, default: '' },
  date: { type: String, default: '' },
  image: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

const blogSchema = new mongoose.Schema({
  posts: [blogPostSchema],
  settings: {
    label: { type: String, default: 'Travel Blog' },
    title: { type: String, default: 'Get Inspired' },
    desc: { type: String, default: 'Stories, guides and tips.' }
  }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
