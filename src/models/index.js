const { sequelize } = require("../services/database");
const User = require("./User");
const Message = require("./Message");
const Product = require("./Product");
const ProductCategory = require("./ProductCategory");
const Article = require("./Article");
const ArticleCategory = require("./ArticleCategory");

/**
 * Model list
 */
const models = {
  User,
  Message,
  Product,
  ProductCategory,
  Article,
  ArticleCategory,
};

/**
 * Message relation
 */
Message.belongsTo(User, { foreignKey: "userId" });
Message.belongsTo(User, { foreignKey: "fromId", as: "from" });

/**
 * Product relation
 */
Product.belongsTo(User, { foreignKey: "userId" });
Product.belongsTo(ProductCategory, {
  foreignKey: "categoryId",
  as: "category",
});
User.hasMany(Product, { foreignKey: "userId" });
ProductCategory.hasMany(Product, { foreignKey: "categoryId" });

/**
 * Article relation
 */
Article.belongsTo(User, { foreignKey: "userId" });
Article.belongsTo(ArticleCategory, {
  foreignKey: "categoryId",
  as: "category",
});
User.hasMany(Article, { foreignKey: "userId" });
ArticleCategory.hasMany(Article, { foreignKey: "categoryId" });

/**
 * DB Sync
 */
const migrate = (params) => {
  return sequelize.sync(params);
};

module.exports = { models, migrate };
