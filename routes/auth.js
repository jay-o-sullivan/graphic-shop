const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
// Uncomment when User model is ready
// const { User } = require('../models');
const { sendPasswordResetEmail } = require('../utils/emailService');

/**
 * Authentication routes for GraphicShop
 * Handles user registration, login, and password reset
 */

// Login page
router.get('/login', (req, res) => {
  const redirect = req.query.redirect || '';
  res.render('login', {
    title: 'Login - GraphicShop',
    redirect,
    activePage: null
  });
});

// Register page
router.get('/register', (req, res) => {
  res.render('register', {
    title: 'Register - GraphicShop',
    activePage: null
  });
});

// Process login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // For demo purposes - in a real app, would validate against database
    if (email === 'user@example.com' && password === 'password123') {
      // Create JWT token
      const token = jwt.sign(
        { id: 1, email, name: 'Demo User', role: 'user' },
        process.env.JWT_SECRET || 'your_jwt_secret_key_here',
        { expiresIn: '7d' }
      );

      // Set cookie
      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      // Redirect
      const redirect = req.body.redirect || '/dashboard';
      res.redirect(redirect);
    } else {
      // Invalid credentials
      res.render('login', {
        title: 'Login - GraphicShop',
        error: 'Invalid email or password',
        email,
        redirect: req.body.redirect || '',
        activePage: null
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).render('login', {
      title: 'Login - GraphicShop',
      error: 'An error occurred during login',
      email: req.body.email,
      redirect: req.body.redirect || '',
      activePage: null
    });
  }
});

// Process registration
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Simple validation
    if (password !== confirmPassword) {
      return res.render('register', {
        title: 'Register - GraphicShop',
        error: 'Passwords do not match',
        name,
        email,
        activePage: null
      });
    }

    // For demo purposes - in a real app, would save to database
    // Create JWT token
    const token = jwt.sign(
      { id: 1, email, name, role: 'user' },
      process.env.JWT_SECRET || 'your_jwt_secret_key_here',
      { expiresIn: '7d' }
    );

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Redirect
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).render('register', {
      title: 'Register - GraphicShop',
      error: 'An error occurred during registration',
      name: req.body.name,
      email: req.body.email,
      activePage: null
    });
  }
});

// Forgot password page
router.get('/forgot-password', (req, res) => {
  res.render('forgot-password', {
    title: 'Forgot Password - GraphicShop',
    activePage: null
  });
});

// Process forgot password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    // For demo purposes - in a real app, would check if user exists

    // Generate reset token
    const resetToken = Math.random().toString(36).substring(2, 15);
    const resetUrl = `${process.env.BASE_URL || 'http://localhost:3000'}/auth/reset-password/${resetToken}`;

    // Send reset email
    await sendPasswordResetEmail(email, resetUrl);

    res.render('forgot-password-success', {
      title: 'Password Reset Email Sent - GraphicShop',
      email,
      activePage: null
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).render('forgot-password', {
      title: 'Forgot Password - GraphicShop',
      error: 'An error occurred while processing your request',
      email: req.body.email,
      activePage: null
    });
  }
});

// Reset password page
router.get('/reset-password/:token', (req, res) => {
  const { token } = req.params;

  res.render('reset-password', {
    title: 'Reset Password - GraphicShop',
    token,
    activePage: null
  });
});

// Process reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body;

    // Simple validation
    if (password !== confirmPassword) {
      return res.render('reset-password', {
        title: 'Reset Password - GraphicShop',
        error: 'Passwords do not match',
        token,
        activePage: null
      });
    }

    // For demo purposes - in a real app, would validate token and update password

    res.render('reset-password-success', {
      title: 'Password Reset Successful - GraphicShop',
      activePage: null
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).render('reset-password', {
      title: 'Reset Password - GraphicShop',
      error: 'An error occurred while resetting your password',
      token: req.body.token,
      activePage: null
    });
  }
});

// Logout
router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});

module.exports = router;
