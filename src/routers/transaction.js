const cart = require("../controllers/transaction-cart");

module.exports = (router) => {
  // Transaction Cart
  router.get("/transaction/cart", cart.getCartItems);
  router.post("/transaction/cart", cart.putCartItem);
  router.delete("/transaction/cart/:id", cart.destroyCartItem);
  router.patch("/transaction/cart/:id", cart.updateCartItem);
};
