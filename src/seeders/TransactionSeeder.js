const { models } = require("../models");

const TransactionSeeder = async () => {
  /**
   * Transaction Seeder
   */

  await models.TransactionCart.bulkCreate([
    {
      userId: 3,
      productId: 2,
      qty: 1,
    },
    {
      userId: 3,
      productId: 3,
      qty: 2,
    },
    {
      userId: 3,
      productId: 4,
      qty: 5,
    },
  ]);
};

module.exports = TransactionSeeder;
