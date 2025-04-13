const jwt = require('jsonwebtoken');
// Uncomment when User model is ready
// const { User } = require('../models');

/**
 * Authentication middleware for GraphicShop
 */

// Authenticate user from JWT token in cookie
exports.authenticateUser = async (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies.token;

    if (!token) {
      // For API requests
      if (req.xhr) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      // For page requests
      return res.redirect(`/auth/login?redirect=${encodeURIComponent(req.originalUrl)}`);
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key_here');

    // For demo purposes - in a real app, would check if user exists in database

    // Add user to request
    req.user = decoded;

    next();
  } catch (error) {
    console.error('Authentication error:', error);

    // Clear invalid token
    res.clearCookie('token');

    // For API requests
    if (req.xhr) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // For page requests
    return res.redirect(`/auth/login?redirect=${encodeURIComponent(req.originalUrl)}`);
  }
};

// Check user role (use after authenticateUser)
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      // For API requests
      if (req.xhr) {
        return res.status(403).json({ message: 'Access denied' });
      }

      // For page requests
      return res.status(403).render('error', {
        title: 'Access Denied',
        message: 'You do not have permission to access this resource',
        activePage: null
      });
    }

    next();
  };
};
