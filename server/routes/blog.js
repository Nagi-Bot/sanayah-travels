const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const auth = require('../middleware/auth');

// GET /api/blog
router.get('/', async (req, res) => {
  try {
    if (!req.dbConnected) return res.json(null);
    let blog = await Blog.findOne();
    if (!blog) {
      blog = await Blog.create({ posts: [], settings: { label: 'Travel Blog', title: 'Get Inspired', desc: 'Stories, guides and tips.' } });
    }
    res.json(blog);
  } catch (err) {
    res.json(null);
  }
});

// POST /api/blog/post - admin add post
router.post('/post', auth, async (req, res) => {
  try {
    const { title, content, date, image } = req.body;
    if (!title) return res.status(400).json({ error: 'Title required' });
    let blog = await Blog.findOne();
    if (!blog) {
      blog = new Blog({ posts: [], settings: {} });
    }
    blog.posts.unshift({
      title: title.trim(),
      content: (content || '').trim(),
      date: date || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      image: image || ''
    });
    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/blog/post/:id - admin edit post
router.put('/post/:id', auth, async (req, res) => {
  try {
    const { title, content, date, image } = req.body;
    let blog = await Blog.findOne();
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    const post = blog.posts.id(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (title) post.title = title.trim();
    if (content !== undefined) post.content = content.trim();
    if (date) post.date = date;
    if (image !== undefined) post.image = image;
    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/blog/post/:id - admin delete post
router.delete('/post/:id', auth, async (req, res) => {
  try {
    let blog = await Blog.findOne();
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    const post = blog.posts.id(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    post.deleteOne();
    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/blog/settings - admin update blog settings
router.put('/settings', auth, async (req, res) => {
  try {
    const { label, title, desc } = req.body;
    let blog = await Blog.findOne();
    if (!blog) blog = new Blog({ posts: [], settings: {} });
    if (label) blog.settings.label = label;
    if (title) blog.settings.title = title;
    if (desc) blog.settings.desc = desc;
    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
