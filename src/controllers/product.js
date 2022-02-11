const fs = require("fs");
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
      name: query.name && { [Op.like]: `%${query.name || ""}%` },
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
        { model: models.User, required: true },
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

const processImageUpload = (body, files, product) => {
  const bodyImages = Array.isArray(body.images) ? body.images : [body.images];
  const images = product
    ? product.images.filter((img) => bodyImages.includes(img))
    : [];

  files?.forEach((file) => {
    if (images?.length >= 6) {
      fs.unlink(file.path, () => {});
      return;
    }

    const filePath = `uploads/products/${file.filename}`;
    images.push(filePath);
  });

  return images;
};

const create = async (req, res) => {
  try {
    if (req.user.role === "user") {
      throw new Error(
        "Maaf, saat ini hanya mitra yang dapat menambah produk marketplace. Silahkan hubungi admin untuk menjadi Mitra SISPAN."
      );
    }

    const { category, name, price, description } = req.body;
    const images = processImageUpload(req.body, req.files);

    const data = {
      userId: req.user.id,
      categoryId: category,
      name,
      price,
      description,
      images,
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

    const { category, name, price, description, status } = req.body;
    const images = processImageUpload(req.body, req.files, product);

    const data = sanitizeObject({
      categoryId: category,
      name,
      price,
      description,
      status,
      images,
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
