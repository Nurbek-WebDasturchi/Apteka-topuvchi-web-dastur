const jwt = require('jsonwebtoken');

module.exports = function authMiddleware(req, res, next) {
  const header = req.headers['authorization'];
  if (!header) return res.status(401).json({ error: 'Token mavjud emas' });
  const token = header.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token formati notogri' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Token yaroqsiz' });
  }
};
