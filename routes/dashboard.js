const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middleware/auth');

// Dashboard home
router.get('/', authenticateUser, (req, res) => {
  // Sample user data
  const user = req.user || {
    id: 1,
    name: 'Demo User',
    email: 'user@example.com'
  };

  res.render('dashboard', {
    title: 'Dashboard - GraphicShop',
    user,
    activePage: 'dashboard'
  });
});

// User profile
router.get('/profile', authenticateUser, (req, res) => {
  // Sample user data
  const user = req.user || {
    id: 1,
    name: 'Demo User',
    email: 'user@example.com',
    phone: '555-123-4567',
    company: 'Demo Company',
    address: '123 Main St, City, Country'
  };

  res.render('profile', {
    title: 'User Profile - GraphicShop',
    user,
    activePage: 'profile'
  });
});

// Update profile
router.post('/profile', authenticateUser, (req, res) => {
  const { name, email, phone, company, address } = req.body;

  // In a real app, would update the user record in database
  console.log('Profile update:', { name, email, phone, company, address });

  res.render('profile', {
    title: 'User Profile - GraphicShop',
    user: {
      ...req.user,
      name,
      email,
      phone,
      company,
      address
    },
    success: 'Profile updated successfully',
    activePage: 'profile'
  });
});

module.exports = router;
