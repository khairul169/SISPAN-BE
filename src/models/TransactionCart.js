const Sequelize = require("sequelize");
const { sequelize } = require("../services/database");

const TransactionCart = sequelize.define(
  "transaction_cart",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: Sequelize.INTEGER,
    },
    productId: {
      type: Sequelize.INTEGER,
    },
    qty: {
      type: Sequelize.INTEGER,
      defaultValue: 1,
    },
    // total: {
    //   type: Sequelize.VIRTUAL,
    //   get() {
    //     return this.product ? this.product.price * this.qty : 0;
    //   },
    // },
  },
  {
    tableName: "transaction_cart",
    timestamps: false,
  }
);

module.exports = TransactionCart;
