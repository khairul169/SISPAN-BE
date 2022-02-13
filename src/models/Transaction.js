const Sequelize = require("sequelize");
const { sequelize } = require("../services/database");

const transactionStatus = {
  pending: "Menunggu Konfirmasi",
  processed: "Diproses",
  completed: "Selesai",
  canceled: "Dibatalkan",
};

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
      type: Sequelize.ENUM(Object.keys(transactionStatus)),
    },
    // statusText: {
    //   type: Sequelize.VIRTUAL,
    //   get() {
    //     return transactionStatus[this.status];
    //   },
    // },
  },
  {
    tableName: "transaction",
    paranoid: true,
  }
);

module.exports = { Transaction, transactionStatus };
