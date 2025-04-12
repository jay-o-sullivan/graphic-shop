const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User } = require('../models');
const { authenticateUser } = require('../middleware/auth');
const { sendPasswordResetEmail } = require('../utils/emailService');

const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password
    });

    // Create and send JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create and send JWT
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({
      message: 'Login successful',
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Logout
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

// Get current user
router.get('/me', authenticateUser, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Login page
router.get('/login', (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('auth/login', { activePage: 'login' });
});

// Register page
router.get('/register', (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('auth/register', { activePage: 'register' });
});

// Forgot password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // For security reasons, don't reveal that the email doesn't exist
      return res.json({ message: 'If your email is registered, you will receive a password reset link shortly.' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    // Update user with reset token
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Send reset email
    const resetUrl = `${process.env.BASE_URL}/auth/reset-password/${resetToken}`;
    await sendPasswordResetEmail(user.email, resetUrl);

    res.json({ message: 'If your email is registered, you will receive a password reset link shortly.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Reset password page
router.get('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;

    // Find user with this token and valid expiry
    const user = await User.findOne({
      where: {
        resetToken: token,
        resetTokenExpiry: { [Op.gt]: Date.now() }
      }
    });

    if (!user) {
      return res.render('auth/reset-password-error', {
        message: 'Password reset link is invalid or has expired.',
        activePage: null
      });
    }

    res.render('auth/reset-password', {
      token,
      activePage: null
    });
  } catch (err) {
    res.status(500).render('error', {
      error: { message: 'An error occurred. Please try again.' },
      activePage: null
    });
  }
});

// Reset password action
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Find user with this token and valid expiry
    const user = await User.findOne({
      where: {
        resetToken: token,
        resetTokenExpiry: { [Op.gt]: Date.now() }
      }
    });

    if (!user) {
      return res.status(400).json({
        message: 'Password reset link is invalid or has expired.'
      });
    }

    // Update user's password and clear reset token
    user.password = password;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    res.json({ message: 'Password has been reset successfully. You can now login with your new password.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Forgot password page
router.get('/forgot-password', (req, res) => {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('auth/forgot-password', { activePage: null });
});

module.exports = router;
