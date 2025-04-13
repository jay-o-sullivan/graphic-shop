/**
 * GraphicShop - Main Server File
 */

// Import required modules
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Set up middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Set up EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Home route
app.get('/', (req, res) => {
  res.render('index', {
    title: 'GraphicShop - Custom Design Services',
    activePage: 'home'
  });
});

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
