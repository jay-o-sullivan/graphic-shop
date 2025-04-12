/**
 * Database initialization script
 *
 * This script will create initial data in the database:
 * - Admin user
 * - Sample portfolio items
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, Portfolio } = require('../models');

// Sample portfolio data
const portfolioItems = [
  {
    title: 'Modern Tech Logo',
    description: 'A sleek, modern logo for a technology startup focused on AI solutions.',
    category: 'logo',
    imageUrl: '/images/sample-logo-1.jpg',
    clientName: 'TechSmart Inc.',
    testimonial: {
      content: 'The logo perfectly captures our company\'s innovative spirit. We\'ve received countless compliments on it!',
      clientName: 'Sarah Johnson, CEO of TechSmart',
      rating: 5
    },
    featured: true
  },
  {
    title: 'Organic Food Brand Identity',
    description: 'A warm, earthy logo and brand identity for an organic food company.',
    category: 'logo',
    imageUrl: '/images/sample-logo-2.jpg',
    clientName: 'Nature\'s Bounty',
    testimonial: {
      content: 'Our sales increased by 30% after rebranding with this beautiful logo. It really connects with our target audience.',
      clientName: 'Michael Green, Marketing Director',
      rating: 5
    },
    featured: true
  },
  {
    title: 'Financial App Icons',
    description: 'A set of cohesive icons for a financial management mobile application.',
    category: 'icon',
    imageUrl: '/images/sample-icons-1.jpg',
    clientName: 'WealthWise App',
    testimonial: {
      content: 'These icons have significantly improved our app\'s user experience. They\'re intuitive and visually pleasing.',
      clientName: 'David Chen, Product Manager',
      rating: 4
    },
    featured: false
  },
  {
    title: 'Summer Music Festival Poster',
    description: 'Vibrant and energetic poster design for an annual music festival.',
    category: 'poster',
    imageUrl: '/images/sample-poster-1.jpg',
    clientName: 'SoundWave Festival',
    testimonial: {
      content: 'The poster generated huge buzz for our event. Ticket sales were record-breaking this year!',
      clientName: 'Lisa Kim, Event Coordinator',
      rating: 5
    },
    featured: true
  },
  {
    title: 'Corporate Web Banners',
    description: 'Professional and clean banner designs for a corporate website.',
    category: 'banner',
    imageUrl: '/images/sample-banner-1.jpg',
    clientName: 'Global Solutions Ltd.',
    testimonial: {
      content: 'These banners have helped maintain a consistent and professional look across our digital presence.',
      clientName: 'Robert Wilson, Digital Marketing Manager',
      rating: 4
    },
    featured: false
  },
  {
    title: 'Children\'s Book Illustration',
    description: 'Whimsical and colorful illustrations for a children\'s storybook.',
    category: 'illustration',
    imageUrl: '/images/sample-illustration-1.jpg',
    clientName: 'Wonder Tales Publishing',
    testimonial: {
      content: 'The illustrations brought our story to life in ways we couldn\'t have imagined. Children absolutely love them!',
      clientName: 'Emma Davis, Author',
      rating: 5
    },
    featured: true
  }
];

// Initialize database
async function initDb() {
  try {
    // Sync all models
    await sequelize.sync({ force: true });
    console.log('Database synchronized');

    // Create admin user
    const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || 'admin123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    await User.create({
      name: 'Admin User',
      email: 'admin@graphicshop.com',
      password: hashedPassword,
      role: 'admin'
    });
    console.log('Admin user created');

    // Create portfolio items
    await Portfolio.bulkCreate(portfolioItems);
    console.log('Sample portfolio items created');

    console.log('Database initialization completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

// Run the initialization
initDb();
