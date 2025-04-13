const express = require('express');
const router = express.Router();
// Uncomment if you need the Portfolio model
// const { Portfolio } = require('../models');

/**
 * Products/Services routes for GraphicShop
 * Handles displaying and filtering design services
 */

// Get all products/services
router.get('/', async (req, res) => {
  try {
    // Sample services data - in a real app, this would come from the database
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
      },
      {
        id: 'business-card',
        title: 'Business Card Design',
        description: 'Eye-catching business card designs that make a great first impression.',
        price: 99,
        category: 'print',
        imageUrl: '/images/business-card.jpg',
        featured: false
      }
    ];

    res.render('products', {
      title: 'Design Services - GraphicShop',
      services,
      activePage: 'products'
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'An error occurred while fetching services'
    });
  }
});

// Get single product/service
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;

    // Sample service data - would normally come from database
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
  } catch (error) {
    console.error('Error fetching service details:', error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'An error occurred while fetching service details'
    });
  }
});

module.exports = router;
