const { models } = require("../models");
const { sanitizeObject, pageFilter } = require("../services/utils");
const response = require("../services/response");
const { Op } = require("../services/database");

const getAll = async (req, res) => {
  try {
    const { query } = req;
    const { offset, limit } = pageFilter(query);

    // Item filter
    const filter = sanitizeObject({
      status: query.status,
    });

    // Item sorting
    let order;

    if (query.order) {
      switch (query.order) {
        case "oldest":
          order = [["createdAt", "ASC"]];
          break;
        case "newest":
        default:
          order = [["createdAt", "DESC"]];
          break;
      }
    }

    const result = await models.Transaction.findAndCountAll({
      where: {
        ...filter,
        [Op.or]: [{ userId: req.user.id }, { sellerId: req.user.id }],
      },
      order,
      offset,
      limit,
    });

    return response.success(res, result);
  } catch (err) {
    return response.error(res, err.message);
  }
};

const getTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await models.Transaction.findOne({
      where: { id },
      include: [
        { model: models.User, as: "seller" },
        { model: models.TransactionItem, as: "items", include: models.Product },
      ],
    });

    return response.success(res, result);
  } catch (err) {
    return response.error(res, err.message);
  }
};

const update = async (req, res) => {
  try {
    const transaction = await models.Transaction.findByPk(req.params.id || 0);
    if (!transaction) {
      throw new Error("Transaction not found!");
    }

    const { status } = req.body;
    const data = sanitizeObject({
      status,
    });

    const result = await transaction.update(data);

    return response.success(res, result);
  } catch (err) {
    return response.error(res, err.message);
  }
};

module.exports = {
  getAll,
  getTransaction,
  update,
};
