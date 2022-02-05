const product = require("../controllers/product");

module.exports = (router) => {
  // Auth
  router.get("/product", product.getAll);
  router.get("/product/:productId", product.getProduct);
  router.post("/product", product.create);
  router.delete("/product/:productId", product.destroy);
  router.patch("/product/:productId", product.update);
};
