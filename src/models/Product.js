const Sequelize = require("sequelize");
const { sequelize } = require("../services/database");

const Product = sequelize.define(
  "product",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: Sequelize.INTEGER,
    },
    categoryId: {
      type: Sequelize.INTEGER,
    },
    name: {
      type: Sequelize.STRING,
    },
    image: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    price: {
      type: Sequelize.DOUBLE,
      defaultValue: 0,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    sales: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    status: {
      type: Sequelize.ENUM("active", "out_stock", "hidden"),
      defaultValue: "active",
    },
  },
  {
    tableName: "products",
    paranoid: true,
  }
);

module.exports = Product;
