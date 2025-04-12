const express = require('express');
const Portfolio = require('../models/Portfolio');

const router = express.Router();

// Get all portfolio items
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;

    let query = {};
    if (category) {
      query.category = category;
    }

    const portfolioItems = await Portfolio.find(query).sort({ featured: -1, createdAt: -1 });

    res.render('portfolio', { portfolioItems, selectedCategory: category });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get portfolio item details
router.get('/:id', async (req, res) => {
  try {
    const portfolioItem = await Portfolio.findById(req.params.id);

    if (!portfolioItem) {
      return res.status(404).render('404');
    }

    // Get related items
    const relatedItems = await Portfolio.find({
      category: portfolioItem.category,
      _id: { $ne: portfolioItem._id }
    }).limit(3);

    res.render('portfolio-detail', { portfolioItem, relatedItems });
  } catch (err) {
    res.status(500).render('error', { error: err });
  }
});

module.exports = router;
