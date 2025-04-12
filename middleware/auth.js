const jwt = require('jsonwebtoken');
const { User } = require('../models');

exports.authenticateUser = async (req, res, next) => {
  try {
    // Get token from cookie or authorization header
    let token;

    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      if (req.xhr) {
        return res.status(401).json({ message: 'Not authorized, please login' });
      }
      return res.redirect('/auth/login?redirect=' + encodeURIComponent(req.originalUrl));
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user still exists
    const user = await User.findByPk(decoded.id);

    if (!user) {
      res.clearCookie('token');
      if (req.xhr) {
        return res.status(401).json({ message: 'Not authorized, please login' });
      }
      return res.redirect('/auth/login');
    }

    // Add user to request
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    res.clearCookie('token');
    if (req.xhr) {
      return res.status(401).json({ message: 'Not authorized, please login' });
    }
    return res.redirect('/auth/login');
  }
};

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      if (req.xhr) {
        return res.status(403).json({ message: 'Not authorized to access this resource' });
      }
      return res.render('errors/403', {
        title: 'Access Denied',
        message: 'You do not have permission to access this resource.'
      });
    }
    next();
  };
};

exports.csrfProtection = (req, res, next) => {
  // Implement CSRF protection
  // This is a placeholder - you should use a library like csurf
  next();
};
