const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  designType: {
    type: DataTypes.ENUM('logo', 'icon', 'poster', 'banner', 'illustration', 'other'),
    allowNull: false
  },
  size: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  additionalRequirements: {
    type: DataTypes.TEXT
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'paid', 'in-progress', 'completed', 'delivered', 'cancelled'),
    defaultValue: 'pending'
  },
  paymentId: {
    type: DataTypes.STRING
  },
  completedWork: {
    type: DataTypes.JSON,
    defaultValue: null
  },
  feedback: {
    type: DataTypes.JSON,
    defaultValue: null
  }
});

module.exports = Order;
