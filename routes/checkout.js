const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Order, User } = require('../models');
const { authenticateUser } = require('../middleware/auth');
const { sendOrderConfirmation } = require('../utils/emailService');

// Display checkout page
router.get('/', (req, res) => {
  // In a real app, you'd get cart items from session or database
  const cartItems = {
    items: [
      {
        id: 'logo-design',
        name: 'Logo Design Package',
        description: 'Standard package with 3 concepts',
        price: 299.00,
        image: '/images/logo-design.jpg'
      }
    ],
    deliveryOption: 'rush',
    deliveryFee: 75.00,
    subtotal: 374.00,
    tax: 22.44,
    total: 396.44
  };

  res.render('checkout', {
    title: 'Checkout - GraphicShop',
    cartItems,
    user: req.user || {}
  });
});

// Create payment intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { total, orderId } = req.body;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId: orderId || 'new-order'
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

// Process order
router.post('/process', authenticateUser, async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      company,
      comments,
      deliveryOption,
      items,
      subtotal,
      tax,
      total
    } = req.body;

    // Create order in database
    const order = await Order.create({
      userId: req.user.id,
      orderNumber: `GS-${Date.now().toString().substr(-7)}`,
      customerName: name,
      customerEmail: email,
      customerPhone: phone || null,
      customerCompany: company || null,
      projectDetails: comments,
      deliveryOption,
      subtotal,
      tax,
      total,
      status: 'pending',
      items: JSON.stringify(items)
    });

    res.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.orderNumber
      }
    });
  } catch (error) {
    console.error('Error processing order:', error);
    res.status(500).json({ error: 'Failed to process order' });
  }
});

// Payment success page
router.get('/success', (req, res) => {
  const orderId = req.query.order_id || 'GS-2023-1045';

  res.render('checkout-success', {
    title: 'Order Confirmation - GraphicShop',
    orderId
  });
});

// Stripe webhook
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
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata.orderId;

      if (orderId !== 'new-order') {
        // Update order status
        const order = await Order.findOne({ where: { id: orderId } });
        if (order) {
          order.status = 'paid';
          order.paymentId = paymentIntent.id;
          await order.save();

          // Send confirmation email
          await sendOrderConfirmation(order);
        }
      }
      break;

    case 'payment_intent.payment_failed':
      const failedPaymentIntent = event.data.object;
      console.log('Payment failed:', failedPaymentIntent.id);
      // Handle failed payment
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({received: true});
});

module.exports = router;
