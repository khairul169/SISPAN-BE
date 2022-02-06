const Sequelize = require("sequelize");
const { sequelize } = require("../services/database");

const Article = sequelize.define(
  "article",
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
    title: {
      type: Sequelize.STRING,
    },
    image: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    content: {
      type: Sequelize.TEXT("long"),
    },
    readCount: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "articles",
    paranoid: true,
  }
);

module.exports = Article;
