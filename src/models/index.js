const { sequelize } = require("../services/database");
const User = require("./User");
const Message = require("./Message");
const Product = require("./Product");
const ProductCategory = require("./ProductCategory");

/**
 * Model list
 */
const models = {
  User,
  Message,
  Product,
  ProductCategory,
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
 * DB Sync
 */
const migrate = (params) => {
  return sequelize.sync(params);
};

module.exports = { models, migrate };
