const message = require("../controllers/message");

module.exports = (router) => {
  // Auth
  router.get("/message", message.getAll);
  router.get("/message/:userId", message.getMessages);
  router.post("/message", message.create);
};
