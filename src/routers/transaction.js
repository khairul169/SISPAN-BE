const transaction = require("../controllers/transaction");
const cart = require("../controllers/transaction-cart");

module.exports = (router) => {
  // Transaction Cart
  router.get("/transaction/cart", cart.getItems);
  router.post("/transaction/cart", cart.store);
  router.delete("/transaction/cart/:id", cart.destroy);
  router.patch("/transaction/cart/:id", cart.update);
  router.post("/transaction/cart/checkout", cart.checkout);

  // Transaction listing
  router.get("/transaction", transaction.getAll);
  router.get("/transaction/:id", transaction.getTransaction);
  router.patch("/transaction/:id", transaction.update);
  router.delete("/transaction/:id", transaction.destroy);
};
