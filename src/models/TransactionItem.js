const Sequelize = require("sequelize");
const { sequelize } = require("../services/database");

const TransactionItem = sequelize.define(
  "transaction_item",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    transactionId: {
      type: Sequelize.INTEGER,
    },
    productId: {
      type: Sequelize.INTEGER,
    },
    qty: {
      type: Sequelize.INTEGER,
      defaultValue: 1,
    },
    total: {
      type: Sequelize.VIRTUAL,
      get() {
        return this.product ? this.product.price * this.qty : 0;
      },
    },
  },
  {
    tableName: "transaction_item",
    timestamps: false,
  }
);

module.exports = TransactionItem;
