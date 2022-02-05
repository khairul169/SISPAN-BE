const Sequelize = require("sequelize");
const { sequelize } = require("../services/database");

const Message = sequelize.define(
  "message",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: Sequelize.INTEGER,
    },
    fromId: {
      type: Sequelize.INTEGER,
    },
    message: {
      type: Sequelize.TEXT,
    },
    createdAt: {
      type: Sequelize.DATE,
    },
    updatedAt: {
      type: Sequelize.DATE,
    },
  },
  {
    tableName: "messages",
  }
);

module.exports = Message;
