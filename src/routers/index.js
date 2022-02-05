const express = require("express");
const { useAuth } = require("../services/jwt");
const auth = require("./auth");
const message = require("./message");
const router = express.Router();

// Public
// router.use("/static", express.static(path.join(__dirname, "../public")));

// Base
router.get("/", (_, res) => res.send("Hey!"));

// Auth
auth(router);

// Routes
router.use(useAuth);
message(router);

module.exports = router;
