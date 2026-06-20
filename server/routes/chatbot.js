const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

// POST /api/chatbot/message - proxy to AI provider
router.post('/message', async (req, res) => {
  try {
    const { message, provider, apiKey, systemPrompt } = req.body;
    if (!message) return res.status(400).json({ error: 'Message required' });

    if (provider === 'gemini' && apiKey) {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: (systemPrompt ? systemPrompt + '\n\n' : '') + 'User: ' + message + '\nAssistant:' }] }]
        })
      });
      const data = await response.json();
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return res.json({ reply: data.candidates[0].content.parts.map(p => p.text).join(' ') });
      }
      return res.json({ reply: 'I apologize, but I couldn\'t process that request. Please contact us directly.' });
    }

    if (provider === 'deepseek' && apiKey) {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + apiKey
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: systemPrompt || 'You are a helpful travel assistant.' },
            { role: 'user', content: message }
          ]
        })
      });
      const data = await response.json();
      if (data.choices && data.choices[0] && data.choices[0].message) {
        return res.json({ reply: data.choices[0].message.content });
      }
      return res.json({ reply: 'I apologize, but I couldn\'t process that request. Please contact us directly.' });
    }

    return res.json({ reply: 'AI is not configured. Please contact us directly.' });
  } catch (err) {
    console.error('Chatbot error:', err);
    res.json({ reply: 'I apologize, but I\'m having trouble connecting. Please try again or contact us directly.' });
  }
});

module.exports = router;
