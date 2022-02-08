const Sequelize = require("sequelize");
const { sequelize } = require("../services/database");

const MessageBox = sequelize.define(
  "message_box",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: Sequelize.INTEGER,
    },
    recipientId: {
      type: Sequelize.INTEGER,
    },
    updatedAt: {
      type: Sequelize.DATE,
    },
  },
  {
    tableName: "message_box",
    timestamps: false,
  }
);

module.exports = MessageBox;
