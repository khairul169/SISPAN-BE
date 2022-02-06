const ArticleSeeder = require("./ArticleSeeder");
const ProductSeeder = require("./ProductSeeder");
const UserSeeder = require("./UserSeeder");

const seed = async () => {
  await UserSeeder();
  await ProductSeeder();
  await ArticleSeeder();
};

module.exports = seed;
