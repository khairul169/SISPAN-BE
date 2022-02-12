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
      // user, admin, consultant, mitra
    },
    signature: {
      type: Sequelize.STRING,
      allowNull: true,
      get() {
        const value = this.getDataValue("signature");
        return value?.length ? value : "Pengguna";
      },
      set(value) {
        this.setDataValue("signature", value !== "Pengguna" ? value : null);
      },
    },
    photo: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    lastOnline: {
      type: Sequelize.DATE,
    },
    // isOnline: {
    //   type: Sequelize.VIRTUAL,
    //   get() {
    //     if (!this.lastOnline) {
    //       return false;
    //     }

    //     // Get time difference
    //     const diff = Date.now() - this.lastOnline;

    //     // Check if last online is more than 5 minutes ago
    //     return diff < 1000 * 60 * 5;
    //   },
    // },
    // isAdmin: {
    //   type: Sequelize.VIRTUAL,
    //   get() {
    //     return this.role === "admin";
    //   },
    // },
    // deviceId: {
    //   type: Sequelize.STRING,
    //   allowNull: true,
    // },
    googleId: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "users",
    defaultScope: {
      attributes: { exclude: ["password"] },
    },
    paranoid: true,
  }
);

module.exports = User;
