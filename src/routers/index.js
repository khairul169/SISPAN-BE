const express = require("express");
const auth = require("./auth");
const router = express.Router();

// Public
// router.use("/static", express.static(path.join(__dirname, "../public")));

// Base
router.get("/", (_, res) => res.send("Hey!"));

// Routes
auth(router);

module.exports = router;
