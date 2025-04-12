const sequelize = require('../config/database');
const User = require('./User');
const Portfolio = require('./Portfolio');
const Order = require('./Order');

// Define model associations
User.hasMany(Order);
Order.belongsTo(User);

// Export models
module.exports = {
  sequelize,
  User,
  Portfolio,
  Order
};
