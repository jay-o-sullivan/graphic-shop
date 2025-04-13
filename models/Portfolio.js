module.exports = (sequelize, DataTypes) => {
  const Portfolio = sequelize.define('Portfolio', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    clientName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    featured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    testimonial: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    tableName: 'portfolios',
    timestamps: true
  });

  Portfolio.associate = function(models) {
    // Define associations here if needed
    // For example: Portfolio.belongsTo(models.User)
  };

  return Portfolio;
};
