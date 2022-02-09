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
      type: Sequelize.VIRTUAL,
      get() {
        return this.images?.length ? this.images[0] : null;
      },
    },
    images: {
      type: Sequelize.TEXT,
      defaultValue: "[]",
      get() {
        return JSON.parse(this.getDataValue("images"));
      },
      set(value) {
        this.setDataValue("images", JSON.stringify(value));
      },
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
