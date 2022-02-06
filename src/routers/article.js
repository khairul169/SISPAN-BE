const article = require("../controllers/article");

module.exports = (router) => {
  // Article
  router.get("/article", article.getAll);
  router.get("/article/:articleId", article.getArticle);
  router.post("/article", article.create);
  router.delete("/article/:articleId", article.destroy);
  router.patch("/article/:articleId", article.update);
};
