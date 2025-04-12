/**
 * GraphicShop - Main Server File
 */

// Import required modules
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const helmet = require('helmet');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Set up middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disabled for development
}));
app.use(compression()); // Compress responses
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cookieParser()); // Parse cookies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Set up EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Define routes
app.get('/', (req, res) => {
  // Create sample featured items for the homepage
  const featuredItems = [
    {
      _id: 'sample1',
      title: 'Modern Logo Design',
      description: 'A clean, modern logo for a tech startup',
      imageUrl: '/images/sample-logo-1.jpg',
      category: 'logo'
    },
    {
      _id: 'sample2',
      title: 'Brand Identity Package',
      description: 'Complete brand identity for an organic food company',
      imageUrl: '/images/sample-logo-2.jpg',
      category: 'branding'
    },
    {
      _id: 'sample3',
      title: 'Event Poster',
      description: 'Eye-catching poster design for a music festival',
      imageUrl: '/images/sample-poster-1.jpg',
      category: 'poster'
    }
  ];

  res.render('index', {
    title: 'GraphicShop - Custom Design Services',
    activePage: 'home',
    featuredItems: featuredItems
  });
});

// Add portfolio routes
app.get('/portfolio', (req, res) => {
  // Sample portfolio items
  const portfolioItems = [
    {
      _id: 'sample1',
      title: 'Modern Logo Design',
      description: 'A clean, modern logo for a tech startup',
      imageUrl: '/images/sample-logo-1.jpg',
      category: 'logo',
      clientName: 'TechFusion'
    },
    {
      _id: 'sample2',
      title: 'Brand Identity Package',
      description: 'Complete brand identity for an organic food company',
      imageUrl: '/images/sample-logo-2.jpg',
      category: 'branding',
      clientName: 'Nature\'s Harvest'
    },
    {
      _id: 'sample3',
      title: 'Event Poster',
      description: 'Eye-catching poster design for a music festival',
      imageUrl: '/images/sample-poster-1.jpg',
      category: 'poster',
      clientName: 'SoundWave Festival'
    },
    {
      _id: 'sample4',
      title: 'Corporate Web Banners',
      description: 'Professional web banners for a financial company',
      imageUrl: '/images/sample-banner-1.jpg',
      category: 'web',
      clientName: 'Capital Investments'
    }
  ];

  res.render('portfolio', {
    title: 'Our Portfolio - GraphicShop',
    activePage: 'portfolio',
    portfolioItems: portfolioItems
  });
});

app.get('/portfolio/:id', (req, res) => {
  // Find portfolio item by ID (in a real app, this would come from a database)
  const id = req.params.id;

  // Sample portfolio item
  const portfolioItem = {
    _id: id,
    title: 'Sample Portfolio Item',
    description: 'This is a detailed description of the portfolio item.',
    imageUrl: '/images/sample-logo-1.jpg',
    category: 'logo',
    clientName: 'Sample Client',
    process: 'Our design process involved several stages of research, sketching, and refinement.',
    results: 'The client was extremely satisfied with the final design, which helped increase their brand recognition.',
    testimonial: {
      content: 'Working with GraphicShop was a pleasure. They delivered exactly what we needed and more!',
      clientName: 'John Doe, CEO',
      clientCompany: 'Sample Company'
    }
  };

  res.render('portfolio-detail', {
    title: `${portfolioItem.title} - GraphicShop Portfolio`,
    activePage: 'portfolio',
    item: portfolioItem
  });
});

app.get('/services', (req, res) => {
  // Sample services
  const services = [
    {
      id: 'logo-design',
      title: 'Logo Design',
      description: 'Professional logo design to establish your brand identity.',
      price: 'Starting at $299',
      imageUrl: '/images/sample-logo-1.jpg'
    },
    {
      id: 'branding',
      title: 'Brand Identity',
      description: 'Complete brand identity packages including logo, business cards, letterhead, and more.',
      price: 'Starting at $599',
      imageUrl: '/images/sample-logo-2.jpg'
    },
    {
      id: 'web-graphics',
      title: 'Web Graphics',
      description: 'Custom graphics for your website or social media platforms.',
      price: 'Starting at $199',
      imageUrl: '/images/sample-banner-1.jpg'
    },
    {
      id: 'print-design',
      title: 'Print Design',
      description: 'Brochures, flyers, posters, and other print materials designed to impress.',
      price: 'Starting at $249',
      imageUrl: '/images/sample-poster-1.jpg'
    }
  ];

  res.render('services', {
    title: 'Our Services - GraphicShop',
    activePage: 'services',
    services: services
  });
});

// Create views folder and index.ejs file
const fs = require('fs');
const viewsDir = path.join(__dirname, 'views');
const publicDir = path.join(__dirname, 'public');

// Create directories if they don't exist
if (!fs.existsSync(viewsDir)) {
  fs.mkdirSync(viewsDir, { recursive: true });
}

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
  fs.mkdirSync(path.join(publicDir, 'css'), { recursive: true });
  fs.mkdirSync(path.join(publicDir, 'js'), { recursive: true });
  fs.mkdirSync(path.join(publicDir, 'images'), { recursive: true });
}

// Create a simple index.ejs file if it doesn't exist
const indexEjsPath = path.join(viewsDir, 'index.ejs');
if (!fs.existsSync(indexEjsPath)) {
  const indexContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><%= title %></title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 20px;
      color: #333;
    }
    h1 {
      color: #2c3e50;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 5px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Welcome to GraphicShop</h1>
    <p>Your one-stop shop for professional graphic design services.</p>
    <p>The server is running successfully! This is a placeholder page.</p>
    <p>To continue developing the application, you'll need to:</p>
    <ol>
      <li>Create proper views and templates</li>
      <li>Set up your database models</li>
      <li>Implement authentication</li>
      <li>Add payment processing</li>
    </ol>
  </div>
</body>
</html>
  `;
  fs.writeFileSync(indexEjsPath, indexContent);
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
