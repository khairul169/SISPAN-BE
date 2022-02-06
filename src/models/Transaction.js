const Sequelize = require("sequelize");
const { sequelize } = require("../services/database");

const Transaction = sequelize.define(
  "transaction",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: Sequelize.INTEGER,
    },
    sellerId: {
      type: Sequelize.INTEGER,
    },
    total: {
      type: Sequelize.DOUBLE,
      defaultValue: 0,
    },
    charge: {
      type: Sequelize.DOUBLE,
      defaultValue: 0,
    },
    discount: {
      type: Sequelize.DOUBLE,
      defaultValue: 0,
    },
    grandTotal: {
      type: Sequelize.DOUBLE,
      defaultValue: 0,
    },
    status: {
      type: Sequelize.ENUM("pending", "processed", "completed", "canceled"),
      defaultValue: "pending",
    },
  },
  {
    tableName: "transaction",
    paranoid: true,
  }
);

module.exports = Transaction;
