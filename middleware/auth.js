const jwt = require('jsonwebtoken');

// Middleware to authenticate user
exports.authenticateUser = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      if (req.xhr) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      return res.redirect('/auth/login');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.clearCookie('token');
    if (req.xhr) {
      res.status(401).json({ message: 'Invalid token', error: err.message });
    } else {
      res.redirect('/auth/login');
    }
  }
};

// Middleware to check admin role
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }

  if (req.xhr) {
    res.status(403).json({ message: 'Access denied: Admin privileges required' });
  } else {
    res.status(403).render('error', {
      error: { message: 'Access denied: Admin privileges required' },
      activePage: null
    });
  }
};
