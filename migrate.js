require('dotenv').config();
const db = require("./src/services/database");
const { migrate } = require("./src/models");
const seed = require("./src/seeders");

const main = async () => {
  // Initialize database
  await db.testConnection();
  await migrate({ force: true });
  await seed();
};

main();
