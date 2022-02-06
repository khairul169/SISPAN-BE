const Article = require("../models/Article");
const ArticleCategory = require("../models/ArticleCategory");

const ArticleSeeder = async () => {
  /**
   * Article Seeder
   */

  await ArticleCategory.bulkCreate([
    { name: "Artikel" }, // 1
    { name: "Informasi" }, // 2
  ]);

  await Article.bulkCreate([
    {
      userId: 1,
      categoryId: 1,
      title: "Bercocok Tanam Bagi Pemula",
      image: "images/articles/article1.png",
      content:
        "<h1>Bercocok Tanam Bagi Pemula</h1><br /><p>Article description.</p>",
    },
    {
      userId: 1,
      categoryId: 2,
      title: "4 Tip Atasi Hama",
      image: "images/articles/article2.png",
      content: "<h1>4 Tip Atasi Hama</h1><br /><p>This is the description.</p>",
    },
  ]);
};

module.exports = ArticleSeeder;
