const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const router = require("./routers");
const db = require("./services/database");
const { migrate } = require("./models");
const seed = require("./seeders");
const app = express();

app.use(cors());
app.use(bodyParser.json());
// app.use(morgan("combined"));
app.use(process.env.BASE_URL, router);

const main = async () => {
  // Start rest api server
  const host = process.env.HOST || "0.0.0.0";
  const port = process.env.PORT || 5000;

  app.listen(port, host, () => {
    console.log(`App listening on ${host}:${port}`);
  });

  // Initialize database
  await db.testConnection();
  // await migrate({ force: true });
  // await seed();
};

module.exports = main;
