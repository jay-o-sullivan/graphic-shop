module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    orderNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    customerName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    customerEmail: {
      type: DataTypes.STRING,
      allowNull: false
    },
    customerPhone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    customerCompany: {
      type: DataTypes.STRING,
      allowNull: true
    },
    projectDetails: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    deliveryOption: {
      type: DataTypes.ENUM('standard', 'express', 'rush'),
      defaultValue: 'standard'
    },
    items: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        return JSON.parse(this.getDataValue('items'));
      },
      set(value) {
        this.setDataValue('items', JSON.stringify(value));
      }
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    tax: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    paymentMethod: {
      type: DataTypes.ENUM('card', 'paypal'),
      allowNull: true
    },
    paymentId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'paid', 'in_progress', 'completed', 'cancelled'),
      defaultValue: 'pending'
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'orders',
    timestamps: true
  });

  Order.associate = function(models) {
    Order.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Order;
};
