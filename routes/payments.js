const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { authenticateUser } = require('../middleware/auth');
const { Order } = require('../models');
const { sendOrderConfirmation } = require('../utils/emailService');

const router = express.Router();

// Create payment intent
router.post('/create-payment-intent', authenticateUser, async (req, res) => {
  try {
    const { orderId } = req.body;

    // Get the order from database
    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Ensure the order belongs to the current user
    if (order.UserId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Create a payment intent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.price * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId: order.id,
        userId: req.user.id
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

// Payment webhook for Stripe
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;

    // Update the order status
    const order = await Order.findByPk(paymentIntent.metadata.orderId);
    if (order) {
      order.status = 'paid';
      order.paymentId = paymentIntent.id;
      await order.save();

      // Send confirmation email
      await sendOrderConfirmation(order);
    }
  }

  res.json({received: true});
});

module.exports = router;
