const { sequelize } = require("../services/database");
const User = require("./User");
const Message = require("./Message");

const models = {
  User,
  Message,
};

Message.belongsTo(User, { foreignKey: "userId" });
Message.belongsTo(User, { foreignKey: "fromId", as: "from" });

const migrate = (params) => {
  return sequelize.sync(params);
};

module.exports = { models, migrate };
