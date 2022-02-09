const user = require("../controllers/user");

module.exports = (router) => {
  // User
  // router.get("/user", user.getUser);
  router.get("/user/search", user.search);
  router.get("/user/:userId?", user.getById);
  // router.post("/user", user.create);
  router.patch("/user/:userId?", user.update);
};
