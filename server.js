require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const compression = require('compression');
const { Sequelize } = require('sequelize');

// Import routes
const authRoutes = require('./routes/auth');
const portfolioRoutes = require('./routes/portfolio');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Sequelize with MySQL
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Test the database connection
sequelize.authenticate()
  .then(() => console.log('Database connection has been established successfully.'))
  .catch(err => console.error('Unable to connect to the database:', err));

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://js.stripe.com", "https://kit.fontawesome.com", "'unsafe-inline'"],
      styleSrc: ["'self'", "https://fonts.googleapis.com", "'unsafe-inline'"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://ka-f.fontawesome.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.stripe.com"],
      frameSrc: ["'self'", "https://js.stripe.com"]
    }
  }
}));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Set global variables for views
app.use((req, res, next) => {
  // Get user from JWT in cookie if it exists
  const token = req.cookies.token;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      res.locals.user = decoded;
    } catch (err) {
      res.clearCookie('token');
    }
  }

  next();
});

// Routes
app.use('/auth', authRoutes);
app.use('/portfolio', portfolioRoutes);
app.use('/orders', orderRoutes);
app.use('/admin', adminRoutes);

// Home route
app.get('/', async (req, res) => {
  try {
    // Get featured portfolio items
    const featuredItems = await sequelize.models.Portfolio.findAll({
      where: { featured: true },
      limit: 6,
      order: [['createdAt', 'DESC']]
    });

    // Get testimonials
    const testimonials = await sequelize.models.Portfolio.findAll({
      where: {
        '$testimonial.content$': { [Sequelize.Op.ne]: null }
      },
      limit: 5,
      order: [['createdAt', 'DESC']]
    });

    res.render('index', {
      activePage: 'home',
      featuredItems,
      testimonials
    });
  } catch (err) {
    console.error(err);
    res.render('index', {
      activePage: 'home',
      featuredItems: [],
      testimonials: []
    });
  }
});

// Handle 404
app.use((req, res) => {
  res.status(404).render('404', {
    activePage: null
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', {
    error: err,
    activePage: null
  });
});

// Sync the database and start the server
sequelize.sync({ alter: process.env.NODE_ENV === 'development' })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => console.error('Unable to sync the database:', err));
