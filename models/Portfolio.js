const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Portfolio = sequelize.define('Portfolio', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('logo', 'icon', 'poster', 'banner', 'illustration', 'other'),
    allowNull: false
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  clientName: {
    type: DataTypes.STRING
  },
  testimonial: {
    type: DataTypes.JSON,
    defaultValue: null
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

module.exports = Portfolio;
