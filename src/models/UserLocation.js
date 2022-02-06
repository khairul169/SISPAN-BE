const Sequelize = require("sequelize");
const { sequelize } = require("../services/database");

const UserLocation = sequelize.define(
  "user_location",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: Sequelize.INTEGER,
    },
    latitude: {
      type: Sequelize.DECIMAL(11, 2),
    },
    longitude: {
      type: Sequelize.DECIMAL(11, 2),
    },
    address: {
      type: Sequelize.STRING,
    },
  },
  {
    tableName: "user_location",
  }
);

module.exports = UserLocation;
