const category = require("../controllers/article-category");
const article = require("../controllers/article");

module.exports = (router) => {
  // Article Category
  router.get("/article/category", category.getAll);
  router.post("/article/category", category.create);
  router.delete("/article/category/:id", category.destroy);
  router.patch("/article/category/:id", category.update);

  // Article
  router.get("/article", article.getAll);
  router.get("/article/:articleId", article.getArticle);
  router.post("/article", article.create);
  router.delete("/article/:articleId", article.destroy);
  router.patch("/article/:articleId", article.update);
};
