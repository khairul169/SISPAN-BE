const Sequelize = require("sequelize");
const { sequelize } = require("../services/database");

const ArticleCategory = sequelize.define(
  "article_category",
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
    tableName: "article_categories",
    paranoid: true,
  }
);

module.exports = ArticleCategory;
