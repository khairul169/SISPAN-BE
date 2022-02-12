const user = require("../controllers/user");
const { upload, compress } = require("../services/file-upload");

const IMG_DIR = "./public/uploads/photos";
const imgUpload = upload(IMG_DIR, "user").single("photo");

module.exports = (router) => {
  // User
  // router.get("/user", user.getUser);
  router.get("/user/search", user.search);
  router.get("/user/:userId?", user.getById);
  // router.post("/user", user.create);
  router.patch("/user/:userId?", imgUpload, compress(1024, 1024), user.update);
  router.delete("/user/:userId", user.destroy);
};
