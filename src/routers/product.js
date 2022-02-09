const product = require("../controllers/product");
const { upload, compress } = require("../services/file-upload");

const IMG_DIR = "./public/uploads/products";
const imgUpload = upload(IMG_DIR, "product").array("image", 6);

module.exports = (router) => {
  // Auth
  router.get("/product", product.getAll);
  router.get("/product/:productId", product.getProduct);
  router.post("/product", imgUpload, compress, product.create);
  router.delete("/product/:productId", product.destroy);
  router.patch("/product/:productId", imgUpload, compress, product.update);
};
