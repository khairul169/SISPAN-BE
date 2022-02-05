const auth = require("../controllers/auth");

module.exports = (router) => {
  // Auth
  router.post("/auth/login", auth.login);
  router.post("/auth/register", auth.register);
};
