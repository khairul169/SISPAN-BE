const auth = require("../controllers/auth");
const { useAuth } = require("../services/jwt");

module.exports = (router) => {
  // Auth
  router.post("/auth/login", auth.login);
  router.get("/auth/validate", useAuth, auth.validate);
  router.post("/auth/register", auth.register);
};
