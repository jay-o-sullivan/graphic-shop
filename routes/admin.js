const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Order = require('../models/Order');
const Portfolio = require('../models/Portfolio');
const { authenticateUser, isAdmin } = require('../middleware/auth');
const { sendWorkDeliveredNotification } = require('../utils/emailService');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../public/uploads');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|pdf|zip/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, JPG, PNG, GIF, PDF, and ZIP files are allowed.'));
    }
  }
});

// Admin dashboard
router.get('/dashboard', authenticateUser, isAdmin, async (req, res) => {
  try {
    const pendingOrders = await Order.countDocuments({ status: 'paid' });
    const inProgressOrders = await Order.countDocuments({ status: 'in-progress' });
    const completedOrders = await Order.countDocuments({ status: 'delivered' });
    const totalOrders = await Order.countDocuments();

    res.render('admin/dashboard', {
      pendingOrders,
      inProgressOrders,
      completedOrders,
      totalOrders
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all orders
router.get('/orders', authenticateUser, isAdmin, async (req, res) => {
  try {
    const { status } = req.query;

    let query = {};
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.render('admin/orders', { orders });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update order status
router.put('/orders/:id/status', authenticateUser, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.json({ message: 'Order status updated', order });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Upload completed work
router.post('/orders/:id/upload', authenticateUser, isAdmin, upload.single('file'), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update order with completed work
    order.completedWork = {
      fileUrl: `/uploads/${req.file.filename}`,
      uploadedAt: Date.now()
    };
    order.status = 'delivered';

    await order.save();

    // Send notification to customer
    sendWorkDeliveredNotification(order);

    res.json({
      message: 'Work uploaded and delivered to customer',
      order
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Portfolio management
router.get('/portfolio', authenticateUser, isAdmin, async (req, res) => {
  try {
    const portfolioItems = await Portfolio.find().sort({ createdAt: -1 });

    res.render('admin/portfolio', { portfolioItems });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Add portfolio item
router.post('/portfolio', authenticateUser, isAdmin, upload.single('image'), async (req, res) => {
  try {
    const { title, description, category, clientName, testimonialContent, testimonialRating, featured } = req.body;

    const portfolioItem = new Portfolio({
      title,
      description,
      category,
      imageUrl: `/uploads/${req.file.filename}`,
      clientName,
      testimonial: {
        content: testimonialContent,
        clientName,
        rating: testimonialRating
      },
      featured: featured === 'on'
    });

    await portfolioItem.save();

    res.redirect('/admin/portfolio');
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Delete portfolio item
router.delete('/portfolio/:id', authenticateUser, isAdmin, async (req, res) => {
  try {
    const portfolioItem = await Portfolio.findByIdAndDelete(req.params.id);

    if (!portfolioItem) {
      return res.status(404).json({ message: 'Portfolio item not found' });
    }

    // Delete the image file if it exists
    const imagePath = path.join(__dirname, '../public', portfolioItem.imageUrl);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    res.json({ message: 'Portfolio item deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
