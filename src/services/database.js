const { Sequelize, Op, col } = require("sequelize");

const { DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_TYPE } = process.env;

const sequelize = new Sequelize({
  host: DB_HOST,
  username: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  dialect: DB_TYPE,
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

const db = {
  sequelize,
  testConnection,
  Op,
  col,
};

module.exports = db;
