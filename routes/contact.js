const express = require('express');
const router = express.Router();

// Get contact page
router.get('/', (req, res) => {
  const serviceId = req.query.service || '';

  let serviceInfo = null;
  if (serviceId) {
    // If coming from a service page, include service info
    serviceInfo = {
      id: serviceId,
      name: serviceId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    };
  }

  res.render('contact', {
    title: 'Contact Us - GraphicShop',
    serviceInfo,
    activePage: 'contact',
    success: false,
    error: false
  });
});

// Process contact form
router.post('/', (req, res) => {
  const { name, email, phone, service, message } = req.body;

  // Validate inputs
  if (!name || !email || !message) {
    return res.render('contact', {
      title: 'Contact Us - GraphicShop',
      activePage: 'contact',
      success: false,
      error: 'Please complete all required fields.',
      formData: req.body
    });
  }

  // In a real app, you would send an email or save to database here
  console.log('Contact form submission:', { name, email, phone, service, message });

  // For demo purposes, just show success
  res.render('contact', {
    title: 'Contact Us - GraphicShop',
    activePage: 'contact',
    success: 'Your message has been sent! We\'ll get back to you soon.',
    error: false
  });
});

module.exports = router;
