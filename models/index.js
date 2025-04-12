const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/database');

// Initialize Sequelize with database config
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    logging: config.logging
  }
);

// Define models
const db = {};

// User model
db.User = require('./user')(sequelize, DataTypes);

// Product/Service models
db.ServiceCategory = require('./serviceCategory')(sequelize, DataTypes);
db.Service = require('./service')(sequelize, DataTypes);
db.Package = require('./package')(sequelize, DataTypes);
db.Addon = require('./addon')(sequelize, DataTypes);

// Order models
db.Order = require('./order')(sequelize, DataTypes);
db.OrderItem = require('./orderItem')(sequelize, DataTypes);

// Portfolio models
db.Portfolio = require('./portfolio')(sequelize, DataTypes);
db.Testimonial = require('./testimonial')(sequelize, DataTypes);

// Marketing models
db.Subscriber = require('./subscriber')(sequelize, DataTypes);
db.Campaign = require('./campaign')(sequelize, DataTypes);

// Define relationships
db.ServiceCategory.hasMany(db.Service);
db.Service.belongsTo(db.ServiceCategory);

db.Service.hasMany(db.Package);
db.Package.belongsTo(db.Service);

db.Service.hasMany(db.Addon);
db.Addon.belongsTo(db.Service);

db.User.hasMany(db.Order);
db.Order.belongsTo(db.User);

db.Order.hasMany(db.OrderItem);
db.OrderItem.belongsTo(db.Order);

db.Service.hasMany(db.OrderItem);
db.OrderItem.belongsTo(db.Service);

db.Package.hasMany(db.OrderItem);
db.OrderItem.belongsTo(db.Package);

db.User.hasMany(db.Portfolio);
db.Portfolio.belongsTo(db.User);

db.User.hasMany(db.Testimonial);
db.Testimonial.belongsTo(db.User);

db.Portfolio.hasOne(db.Testimonial);
db.Testimonial.belongsTo(db.Portfolio);

// Export db object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
