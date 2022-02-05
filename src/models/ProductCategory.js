const Sequelize = require("sequelize");
const { sequelize } = require("../services/database");

const ProductCategory = sequelize.define(
  "product_category",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      unique: true,
    },
  },
  {
    tableName: "product_categories",
    timestamps: false,
    paranoid: true,
  }
);

module.exports = ProductCategory;
