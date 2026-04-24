const authMiddleware = require('./auth');

module.exports = function isAdmin(req, res, next) {
  authMiddleware(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Faqat admin uchun' });
    }
    next();
  });
};
