const Sequelize = require("sequelize");
const { sequelize } = require("../services/database");

const User = sequelize.define(
  "user",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: true,
    },
    name: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: true,
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    password: {
      type: Sequelize.STRING,
    },
    role: {
      type: Sequelize.STRING(50),
      defaultValue: "user",
    },
    createdAt: {
      type: Sequelize.DATE,
    },
    updatedAt: {
      type: Sequelize.DATE,
    },
    lastOnline: {
      type: Sequelize.DATE,
    },
    isOnline: {
      type: Sequelize.VIRTUAL,
      get() {
        if (!this.lastOnline) {
          return false;
        }

        // Get time difference
        const diff = Date.now() - this.lastOnline;

        // Check if last online is more than 5 minutes ago
        return diff < 1000 * 60 * 5;
      },
    },
  },
  {
    tableName: "users",
    defaultScope: {
      attributes: { exclude: ["password"] },
    },
  }
);

module.exports = User;
