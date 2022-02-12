const category = require("../controllers/product-category");
const product = require("../controllers/product");
const { upload, compress } = require("../services/file-upload");

const IMG_DIR = "./public/uploads/products";
const imgUpload = upload(IMG_DIR, "product").array("image", 6);

module.exports = (router) => {
  // Product Category
  router.get("/product/category", category.getAll);
  router.post("/product/category", category.create);
  router.delete("/product/category/:id", category.destroy);
  router.patch("/product/category/:id", category.update);

  // Product
  router.get("/product", product.getAll);
  router.get("/product/:productId", product.getProduct);
  router.post("/product", imgUpload, compress(), product.create);
  router.delete("/product/:productId", product.destroy);
  router.patch("/product/:productId", imgUpload, compress(), product.update);
};
