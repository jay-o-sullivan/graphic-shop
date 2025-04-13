const express = require('express');
const router = express.Router();

// Get all portfolio items
router.get('/', (req, res) => {
  // Sample portfolio data
  const portfolioItems = [
    {
      id: 'tech-startup-logo',
      title: 'Tech Startup Logo',
      description: 'Modern, minimalist logo for a technology startup.',
      category: 'logo-design',
      imageUrl: '/images/portfolio/tech-logo.jpg',
      client: 'InnovateTech Solutions'
    },
    {
      id: 'restaurant-branding',
      title: 'Restaurant Brand Package',
      description: 'Complete brand identity for a new upscale restaurant.',
      category: 'branding',
      imageUrl: '/images/portfolio/restaurant-brand.jpg',
      client: 'Fusion Kitchen'
    },
    {
      id: 'event-poster',
      title: 'Music Festival Poster',
      description: 'Eye-catching poster design for an annual music festival.',
      category: 'print-design',
      imageUrl: '/images/portfolio/festival-poster.jpg',
      client: 'SoundWave Festival'
    },
    {
      id: 'ecommerce-website',
      title: 'E-commerce Website Design',
      description: 'User-friendly interface design for an online fashion store.',
      category: 'web-design',
      imageUrl: '/images/portfolio/ecommerce-web.jpg',
      client: 'ModaStyle Fashion'
    }
  ];

  res.render('portfolio', {
    title: 'Our Portfolio - GraphicShop',
    portfolioItems,
    activePage: 'portfolio'
  });
});

// Get portfolio item details
router.get('/:id', (req, res) => {
  const id = req.params.id;

  // Sample detailed portfolio item
  const portfolioItem = {
    id: id,
    title: id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    description: 'Comprehensive design project that delivered outstanding results.',
    fullDescription: 'This project involved a deep dive into the client\'s brand values and market position. Through collaborative sessions and iterative design, we created a visual identity that perfectly captured their essence.',
    category: id.includes('logo') ? 'logo-design' : (id.includes('brand') ? 'branding' : 'print-design'),
    imageUrl: `/images/portfolio/${id}.jpg`,
    images: [
      `/images/portfolio/${id}-1.jpg`,
      `/images/portfolio/${id}-2.jpg`,
      `/images/portfolio/${id}-3.jpg`
    ],
    client: 'Sample Client Name',
    completedDate: new Date().toLocaleDateString(),
    challenge: 'The client needed a distinctive visual identity that would stand out in a crowded market while still appealing to their target demographic.',
    solution: 'We developed a unique design approach that balanced innovation with familiarity, creating a look that was both fresh and accessible.',
    results: 'The new design increased brand recognition by 45% and helped the client secure three major partnerships within the first month.',
    testimonial: {
      quote: 'Working with GraphicShop was a game-changer for our brand. The team understood our vision immediately and translated it into designs that exceeded our expectations.',
      author: 'Jane Smith',
      position: 'Marketing Director',
      company: 'Sample Client'
    }
  };

  res.render('portfolio-detail', {
    title: `${portfolioItem.title} - GraphicShop Portfolio`,
    item: portfolioItem,
    activePage: 'portfolio'
  });
});

module.exports = router;
