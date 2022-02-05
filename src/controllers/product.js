const { models } = require("../models");
const { Op } = require("../services/database");
const { sanitizeObject, pageFilter } = require("../services/utils");
const response = require("../services/response");

const getAll = async (req, res) => {
  try {
    const { query } = req;
    const { offset, limit } = pageFilter(query);
    const visibilityFilter = ["active", "out_stock"];

    // Item visibility
    if (
      (query.user && req.user.id === query.user) ||
      req.user.role === "admin"
    ) {
      visibilityFilter.push("hidden");
    }

    // Item filter
    const filter = sanitizeObject({
      status: { [Op.in]: visibilityFilter },
      userId: query.user,
      categoryId: query.category,
      name: query.name ? { [Op.like]: `%${query.name}%` } : undefined,
    });

    // Item sorting
    const order = [["createdAt", "DESC"]];

    if (query.order) {
      switch (query.order) {
        case "price_higher":
          order.unshift(["price", "DESC"]);
          break;
        case "price_lower":
          order.unshift(["price", "ASC"]);
          break;
        case "sales":
          order.unshift(["sales", "DESC"]);
          break;
        case "updated":
          order.unshift(["updatedAt", "DESC"]);
          break;
        case "date":
        default:
          break;
      }
    }

    const result = await models.Product.findAndCountAll({
      where: filter,
      include: [
        { model: models.User },
        { model: models.ProductCategory, as: "category" },
      ],
      order,
      offset,
      limit,
    });

    return response.success(res, result);
  } catch (err) {
    return response.error(res, err.message);
  }
};

const getProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const result = await models.Product.findOne({
      where: { id: productId },
      include: [
        { model: models.User },
        { model: models.ProductCategory, as: "category" },
      ],
    });

    return response.success(res, result);
  } catch (err) {
    return response.error(res, err.message);
  }
};

const create = async (req, res) => {
  try {
    const { categoryId, name, image, price, description } = req.body;

    const data = {
      userId: req.user.id,
      categoryId,
      name,
      image,
      price,
      description,
    };

    const result = await models.Product.create(data);

    return response.success(res, result);
  } catch (err) {
    return response.error(res, err.message);
  }
};

const update = async (req, res) => {
  try {
    const product = await models.Product.findByPk(req.params.productId || 0);
    if (!product) {
      throw new Error("Product not found!");
    }

    const { categoryId, name, image, price, description, status } = req.body;

    const data = sanitizeObject({
      categoryId,
      name,
      image,
      price,
      description,
      status,
    });

    const result = await product.update(data);

    return response.success(res, result);
  } catch (err) {
    return response.error(res, err.message);
  }
};

const destroy = async (req, res) => {
  try {
    const product = await models.Product.findByPk(req.params.productId || 0);
    if (!product) {
      throw new Error("Product not found!");
    }

    await product.destroy();

    return response.success(res, true);
  } catch (err) {
    return response.error(res, err.message);
  }
};

module.exports = {
  getAll,
  getProduct,
  create,
  update,
  destroy,
};
