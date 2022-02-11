const { models } = require("../models");
const { Op } = require("../services/database");
const { sanitizeObject, pageFilter } = require("../services/utils");
const response = require("../services/response");

const getAll = async (req, res) => {
  try {
    const { query } = req;
    const { offset, limit } = pageFilter(query, true);

    // Item filter
    const filter = sanitizeObject({
      name: query.name && { [Op.like]: `%${query.name}%` },
    });

    const result = await models.ProductCategory.findAndCountAll({
      where: filter,
      order: [["name", "ASC"]],
      offset,
      limit,
    });

    return response.success(res, result);
  } catch (err) {
    return response.error(res, err.message);
  }
};

const create = async (req, res) => {
  try {
    const { name } = req.body;
    const result = await models.ProductCategory.create({ name });

    return response.success(res, result);
  } catch (err) {
    return response.error(res, err.message);
  }
};

const update = async (req, res) => {
  try {
    const item = await models.ProductCategory.findByPk(req.params.id || 0);
    if (!item) {
      throw new Error("Category not found!");
    }

    const { name } = req.body;
    const result = await item.update({ name });

    return response.success(res, result);
  } catch (err) {
    return response.error(res, err.message);
  }
};

const destroy = async (req, res) => {
  try {
    const item = await models.ProductCategory.findByPk(req.params.id || 0);
    if (!item) {
      throw new Error("Category not found!");
    }

    await item.destroy();
    return response.success(res, true);
  } catch (err) {
    return response.error(res, err.message);
  }
};

module.exports = {
  getAll,
  create,
  update,
  destroy,
};
