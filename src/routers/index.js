const express = require("express");
const path = require("path");
const User = require("../models/User");
const { useAuth } = require("../services/jwt");
const response = require("../services/response");
const router = express.Router();

const auth = require("./auth");
const message = require("./message");
const product = require("./product");
const user = require("./user");
const article = require("./article");

// Public
router.use("/static", express.static(path.join(__dirname, "../../public")));

// Base
router.get("/", (_, res) => res.send("Hey!"));

// Auth
auth(router);

router.use(useAuth);

router.use(async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    user.lastOnline = Date.now();
    await user.save();

    req.jwtData = req.user;
    req.user = user;

    next();
  } catch (err) {
    return response.error(res, err.message);
  }
});

// Routes
message(router);
user(router);
product(router);
article(router);

module.exports = router;
