// Vercel serverless entry point
module.exports = function(req, res) {
  res.status(200).json({ status: 'ok', message: 'API function is working', path: req.url });
};
