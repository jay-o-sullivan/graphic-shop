const express = require('express');
const Order = require('../models/Order');
const { authenticateUser } = require('../middleware/auth');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { sendOrderConfirmation } = require('../utils/emailService');
const path = require('path');

const router = express.Router();

/**
 * Orders routes for GraphicShop
 * Handles order management and viewing
 */

// Get price calculator
router.get('/quote', (req, res) => {
  res.render('quote');
});

// Calculate price
router.post('/calculate-price', (req, res) => {
  try {
    const { designType, size } = req.body;

    // Basic pricing logic
    let basePrice = 0;

    switch (designType) {
      case 'logo':
        basePrice = 300;
        break;
      case 'icon':
        basePrice = 100;
        break;
      case 'poster':
        basePrice = 200;
        break;
      case 'banner':
        basePrice = 150;
        break;
      case 'illustration':
        basePrice = 250;
        break;
      default:
        basePrice = 200;
    }

    // Adjust for size
    let sizeMultiplier = 1;
    switch (size) {
      case 'small':
        sizeMultiplier = 0.8;
        break;
      case 'medium':
        sizeMultiplier = 1;
        break;
      case 'large':
        sizeMultiplier = 1.5;
        break;
      case 'extra-large':
        sizeMultiplier = 2;
        break;
    }

    const price = Math.round(basePrice * sizeMultiplier);

    res.json({ price });
  } catch (err) {
    res.status(500).json({ message: 'Error calculating price', error: err.message });
  }
});

// Create new order
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { designType, size, description, additionalRequirements } = req.body;

    // Recalculate price on server to prevent manipulation
    let basePrice = 0;

    switch (designType) {
      case 'logo':
        basePrice = 300;
        break;
      case 'icon':
        basePrice = 100;
        break;
      case 'poster':
        basePrice = 200;
        break;
      case 'banner':
        basePrice = 150;
        break;
      case 'illustration':
        basePrice = 250;
        break;
      default:
        basePrice = 200;
    }

    // Adjust for size
    let sizeMultiplier = 1;
    switch (size) {
      case 'small':
        sizeMultiplier = 0.8;
        break;
      case 'medium':
        sizeMultiplier = 1;
        break;
      case 'large':
        sizeMultiplier = 1.5;
        break;
      case 'extra-large':
        sizeMultiplier = 2;
        break;
    }

    const price = Math.round(basePrice * sizeMultiplier);

    // Create order
    const order = new Order({
      user: req.user.userId,
      designType,
      size,
      description,
      additionalRequirements,
      price
    });

    await order.save();

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: price * 100, // Stripe uses cents
      currency: 'usd',
      metadata: { orderId: order._id.toString() }
    });

    res.status(201).json({
      message: 'Order created successfully',
      order,
      clientSecret: paymentIntent.client_secret
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Confirm payment
router.post('/confirm-payment', authenticateUser, async (req, res) => {
  try {
    const { orderId, paymentId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify that the user owns this order
    if (order.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Update order status
    order.status = 'paid';
    order.paymentId = paymentId;
    await order.save();

    // Send confirmation email
    sendOrderConfirmation(order);

    res.json({ message: 'Payment confirmed', order });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all orders (requires authentication)
router.get('/', authenticateUser, async (req, res) => {
  try {
    // Sample orders data - in a real app, would fetch from database
    const orders = [
      {
        id: 'GS-2023-1045',
        date: new Date(),
        service: 'Logo Design',
        status: 'in_progress',
        price: 299
      },
      {
        id: 'GS-2023-1032',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        service: 'Business Card Design',
        status: 'completed',
        price: 99
      }
    ];

    res.render('orders', {
      title: 'My Orders - GraphicShop',
      orders,
      activePage: 'orders'
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'An error occurred while fetching orders'
    });
  }
});

// Get specific order details
router.get('/:id', authenticateUser, async (req, res) => {
  try {
    const id = req.params.id;

    // Sample order data - would normally come from database
    const order = {
      id: id,
      date: new Date(),
      service: 'Logo Design',
      status: 'in_progress',
      price: 299,
      deliveryOption: 'standard',
      projectDetails: 'Modern logo design for a tech startup',
      files: [
        {
          name: 'requirements.pdf',
          size: '1.2 MB',
          date: new Date()
        }
      ],
      timeline: [
        {
          status: 'created',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          message: 'Order placed'
        },
        {
          status: 'in_progress',
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
          message: 'Designer assigned'
        }
      ]
    };

    res.render('order-detail', {
      title: `Order ${order.id} - GraphicShop`,
      order,
      activePage: 'orders'
    });
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'An error occurred while fetching order details'
    });
  }
});

// Submit feedback for completed order
router.post('/:id/feedback', authenticateUser, async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    // For demo purposes - in a real app, would save to database
    console.log(`Feedback for order ${id}: ${rating} stars - ${comment}`);

    res.redirect(`/orders/${id}?feedback=success`);
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'An error occurred while submitting feedback'
    });
  }
});

// Download completed work
router.get('/:id/download/:fileId', authenticateUser, (req, res) => {
  // For demo purposes - in a real app, would stream the file
  const { id, fileId } = req.params;

  res.download(
    path.join(__dirname, '../public/sample-files/sample-logo.zip'),
    `logo-design-${id}.zip`
  );
});

// Get user's orders
router.get('/my-orders', authenticateUser, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId }).sort({ createdAt: -1 });

    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Payment page
router.get('/payment/:id', authenticateUser, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).render('404');
    }

    // Verify that the user owns this order
    if (order.UserId !== req.user.userId) {
      return res.status(403).render('error', {
        error: { message: 'Unauthorized: You do not have permission to access this order' },
        activePage: null
      });
    }

    // If order is already paid, redirect to order details
    if (order.status !== 'pending') {
      return res.redirect(`/orders/${order.id}`);
    }

    // If there's no client secret in the query, create a new payment intent
    let clientSecret = req.query.secret;

    if (!clientSecret) {
      // Create Stripe payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(order.price * 100), // Stripe uses cents
        currency: 'usd',
        metadata: { orderId: order.id.toString() }
      });

      clientSecret = paymentIntent.client_secret;
    }

    res.render('payment', {
      order,
      clientSecret,
      stripePublicKey: process.env.STRIPE_PUBLIC_KEY,
      activePage: null
    });
  } catch (err) {
    res.status(500).render('error', {
      error: { message: 'An error occurred while loading the payment page' },
      activePage: null
    });
  }
});

module.exports = router;
