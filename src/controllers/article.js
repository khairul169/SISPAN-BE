const { models } = require("../models");
const { Op } = require("../services/database");
const { sanitizeObject, pageFilter } = require("../services/utils");
const response = require("../services/response");

const getAll = async (req, res) => {
  try {
    const { query } = req;
    const { offset, limit } = pageFilter(query);

    // Item filter
    const filter = sanitizeObject({
      userId: query.user,
      categoryId: query.category,
      title: query.title ? { [Op.like]: `%${query.title}%` } : undefined,
    });

    // Item sorting
    const order = [["createdAt", "DESC"]];

    if (query.order) {
      switch (query.order) {
        case "readCount":
          order.unshift(["readCount", "DESC"]);
          break;
        case "updated":
          order.unshift(["updatedAt", "DESC"]);
          break;
        case "date":
        default:
          break;
      }
    }

    const result = await models.Article.findAndCountAll({
      where: filter,
      include: [
        { model: models.User },
        { model: models.ArticleCategory, as: "category" },
      ],
      attributes: { exclude: ["content"] },
      order,
      offset,
      limit,
    });

    return response.success(res, result);
  } catch (err) {
    return response.error(res, err.message);
  }
};

const getArticle = async (req, res) => {
  try {
    const { articleId } = req.params;
    const article = await models.Article.findOne({
      where: { id: articleId },
      include: [
        { model: models.User },
        { model: models.ArticleCategory, as: "category" },
      ],
    });

    if (req.query.isRead) {
      // Increase read count
      await article.update({ readCount: article.readCount + 1 });
    }

    return response.success(res, article);
  } catch (err) {
    return response.error(res, err.message);
  }
};

const create = async (req, res) => {
  try {
    const { category, title, image, content } = req.body;

    const data = {
      userId: req.user.id,
      categoryId: category,
      title,
      image,
      content,
    };

    const result = await models.Article.create(data);

    return response.success(res, result);
  } catch (err) {
    return response.error(res, err.message);
  }
};

const update = async (req, res) => {
  try {
    const article = await models.Article.findByPk(req.params.articleId || 0);
    if (!article) {
      throw new Error("Article not found!");
    }

    const { category, title, image, content } = req.body;

    const data = sanitizeObject({
      categoryId: category,
      title,
      image,
      content,
    });

    const result = await article.update(data);

    return response.success(res, result);
  } catch (err) {
    return response.error(res, err.message);
  }
};

const destroy = async (req, res) => {
  try {
    const article = await models.Article.findByPk(req.params.articleId || 0);
    if (!article) {
      throw new Error("Article not found!");
    }

    await article.destroy();

    return response.success(res, true);
  } catch (err) {
    return response.error(res, err.message);
  }
};

module.exports = {
  getAll,
  getArticle,
  create,
  update,
  destroy,
};
