const { sequelize } = require("../services/database");
const User = require("./User");

const models = {
  User,
};

const migrate = (params) => {
  return sequelize.sync(params);
};

module.exports = { models, migrate };
