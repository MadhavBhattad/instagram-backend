const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, 'secret');
    req.user = await User.findById(decoded.userId);
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports = authenticate;
