const ArticleSeeder = require("./ArticleSeeder");
const ProductSeeder = require("./ProductSeeder");
const TransactionSeeder = require("./TransactionSeeder");
const UserSeeder = require("./UserSeeder");

const seed = async () => {
  await UserSeeder();
  await ProductSeeder();
  await ArticleSeeder();
  // await TransactionSeeder();
};

module.exports = seed;
