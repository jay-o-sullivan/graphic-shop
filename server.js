/**
 * GraphicShop - Main Server File
 */

// Import required modules
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const expressLayouts = require('express-ejs-layouts');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Set up middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Handle favicon requests
app.get('/favicon.ico', (req, res) => {
  res.type('image/x-icon');
  res.status(204).end();
});

// Add cleaner middleware to prevent layout duplication
app.use((req, res, next) => {
  // Save the original render method
  const originalRender = res.render;

  // Override the render method
  res.render = function(view, options, callback) {
    // Ensure options exists
    options = options || {};

    // Set a flag to ensure layouts aren't duplicated
    options._layoutUsed = true;

    // Call the original render method
    return originalRender.call(this, view, options, callback);
  };

  next();
});

// Set up EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('view options', { layout: 'layouts/main' });

// Enable layout support with express-ejs-layouts
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// Import routes
const checkoutRoutes = require('./routes/checkout');
const portfolioRoutes = require('./routes/portfolio');
const contactRoutes = require('./routes/contact');
const aboutRoutes = require('./routes/about');
const dashboardRoutes = require('./routes/dashboard');

// Home route
app.get('/', (req, res) => {
  res.render('index', {
    title: 'GraphicShop - Custom Design Services',
    activePage: 'home'
  });
});

// Use routes
app.use('/products', require('./routes/products'));
app.use('/checkout', checkoutRoutes);
app.use('/portfolio', portfolioRoutes);
app.use('/contact', contactRoutes);
app.use('/about', aboutRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/profile', dashboardRoutes); // Profile routes are in dashboard.js

// Simple products route (without database)
app.get('/products', (req, res) => {
  // Sample data
  const services = [
    {
      id: 'logo-design',
      title: 'Logo Design',
      description: 'Professional logo design to establish your brand identity.',
      price: 299,
      category: 'branding',
      imageUrl: '/images/logo-design.jpg',
      featured: true
    },
    {
      id: 'brand-identity',
      title: 'Brand Identity Package',
      description: 'Complete brand identity including logo, business cards, letterhead and brand guidelines.',
      price: 699,
      category: 'branding',
      imageUrl: '/images/branding-package.jpg',
      featured: true
    },
    {
      id: 'social-media-pack',
      title: 'Social Media Package',
      description: 'Custom graphics for your social media profiles including post templates and profile images.',
      price: 249,
      category: 'digital',
      imageUrl: '/images/social-media-pack.jpg',
      featured: false
    }
  ];

  res.render('products', {
    title: 'Design Services - GraphicShop',
    services,
    activePage: 'products'
  });
});

// Product detail route (without database)
app.get('/products/:id', (req, res) => {
  // Get product ID from params
  const id = req.params.id;

  // Sample data for this product
  const service = {
    id: id,
    title: id === 'logo-design' ? 'Logo Design' : 'Design Service',
    description: 'Professional design service to elevate your brand.',
    fullDescription: 'Our professional design service is tailored to meet your specific needs. We work closely with you to understand your brand, target audience, and goals to deliver designs that exceed your expectations.',
    price: id === 'logo-design' ? 299 : 199,
    category: 'branding',
    imageUrl: '/images/logo-design.jpg',
    featured: true,
    process: [
      'Consultation and requirements gathering',
      'Research and concept development',
      'Initial designs and presentations',
      'Revisions based on feedback',
      'Final delivery in all required formats'
    ],
    deliverables: [
      'Vector source files',
      'High-resolution PNG files',
      'Web-optimized versions',
      'Usage guidelines'
    ],
    testimonials: [
      {
        content: 'The design exceeded my expectations. Highly recommend!',
        author: 'John Smith',
        company: 'ABC Company',
        rating: 5
      }
    ]
  };

  res.render('product-detail', {
    title: `${service.title} - GraphicShop`,
    service,
    activePage: 'products'
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).render('error', {
    title: 'Page Not Found',
    message: 'The page you are looking for does not exist.',
    activePage: null
  });
});

// Handle errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', {
    title: 'Server Error',
    message: 'Something went wrong on our end.',
    activePage: null
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
