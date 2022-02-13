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
    no: {
      type: Sequelize.STRING,
      allowNull: true,
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
    latitude: {
      type: Sequelize.DECIMAL(11, 2),
      allowNull: true,
    },
    longitude: {
      type: Sequelize.DECIMAL(11, 2),
      allowNull: true,
    },
    address: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "transaction",
    paranoid: true,
  }
);

module.exports = { Transaction, transactionStatus };
