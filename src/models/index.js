const { sequelize } = require("../services/database");
const User = require("./User");
const UserLocation = require("./UserLocation");
const Message = require("./Message");
const MessageBox = require("./MessageBox");
const Product = require("./Product");
const ProductCategory = require("./ProductCategory");
const Article = require("./Article");
const ArticleCategory = require("./ArticleCategory");
const TransactionCart = require("./TransactionCart");
const Transaction = require("./Transaction");
const TransactionItem = require("./TransactionItem");

/**
 * Model list
 */
const models = {
  // User
  User,
  UserLocation,
  Message,
  MessageBox,

  // Product
  Product,
  ProductCategory,

  // Article
  Article,
  ArticleCategory,

  // Transaction
  TransactionCart,
  Transaction,
  TransactionItem,
};

/**
 * User relation
 */
UserLocation.belongsTo(User, { foreignKey: "userId" });
User.hasOne(UserLocation, { foreignKey: "userId", as: "location" });

/**
 * Message relation
 */
Message.belongsTo(User, { foreignKey: "userId" });
Message.belongsTo(User, { foreignKey: "fromId", as: "from" });
MessageBox.belongsTo(User, { foreignKey: "userId" });
MessageBox.belongsTo(User, { foreignKey: "recipientId", as: "recipient" });

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
 * Transaction relation
 */
TransactionCart.belongsTo(User, { foreignKey: "userId" });
TransactionCart.belongsTo(Product, { foreignKey: "productId" });
User.hasMany(TransactionCart, { foreignKey: "userId" });

TransactionItem.belongsTo(Transaction, { foreignKey: "transactionId" });
TransactionItem.belongsTo(Product, { foreignKey: "productId" });
Transaction.hasMany(TransactionItem, {
  foreignKey: "transactionId",
  as: "items",
});

Transaction.belongsTo(User, { foreignKey: "userId" });
Transaction.belongsTo(User, { foreignKey: "sellerId", as: "seller" });
User.hasMany(Transaction, { foreignKey: "userId" });

/**
 * DB Sync
 */
const migrate = async (params) => {
  return sequelize.sync(params);
};

const insertOrUpdate = async (model, condition, values) => {
  const find = await model.findOne({ where: condition });

  if (find) {
    return find.update(values);
  }

  return model.create({ ...condition, ...values });
};

module.exports = { models, migrate, insertOrUpdate };
