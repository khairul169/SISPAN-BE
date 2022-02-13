const { models } = require("../models");
const { sanitizeObject, pageFilter } = require("../services/utils");
const response = require("../services/response");
const { Op, literal } = require("../services/database");
const { transactionStatus } = require("../models/Transaction");

const getAll = async (req, res) => {
  try {
    const { query } = req;
    const { offset, limit } = pageFilter(query);

    // Item filter
    const filter = sanitizeObject({
      status: query.status,
    });

    // Item sorting
    let order = ["createdAt", "DESC"];

    if (query.order) {
      switch (query.order) {
        case "oldest":
          order = ["createdAt", "ASC"];
          break;
        case "newest":
        default:
          break;
      }
    }

    const transactionList = await models.Transaction.findAndCountAll({
      where: {
        ...filter,
        [Op.or]: [{ userId: req.user.id }, { sellerId: req.user.id }],
      },
      attributes: {
        include: [[literal("IF(sellerId=$1, 1, 0)"), "isSeller"]],
      },
      bind: [req.user.id],
      include: [
        {
          model: models.User,
          attributes: ["id", "name"],
        },
        {
          model: models.User,
          as: "seller",
          attributes: ["id", "name"],
        },
        {
          model: models.TransactionItem,
          as: "items",
          include: {
            model: models.Product,
            attributes: ["name", "images"],
          },
        },
      ],
      order: [order],
      offset,
      limit,
    });

    const result = {
      count: transactionList.count,
      rows: transactionList.rows.map((row) => ({
        ...row.get({ plain: true }),
        statusText: transactionStatus[row.status],
      })),
    };

    return response.success(res, result);
  } catch (err) {
    return response.error(res, err.message);
  }
};

const getTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await models.Transaction.findOne({
      where: { id },
      attributes: {
        include: [[literal("IF(sellerId=$1, 1, 0)"), "isSeller"]],
      },
      bind: [req.user.id],
      include: [
        { model: models.User },
        { model: models.User, as: "seller" },
        { model: models.TransactionItem, as: "items", include: models.Product },
      ],
    });

    const result = { ...transaction.get({ plain: true }) };
    result.statusText = transactionStatus[result.status];

    return response.success(res, result);
  } catch (err) {
    return response.error(res, err.message);
  }
};

const update = async (req, res) => {
  try {
    const transaction = await models.Transaction.findByPk(req.params.id || 0, {
      include: {
        model: models.TransactionItem,
        as: "items",
        include: models.Product,
      },
    });
    if (!transaction) {
      throw new Error("Transaction not found!");
    }

    if (transaction.status === "canceled") {
      throw new Error(
        "Tidak dapat mengubah status transaksi yang telah dibatalkan."
      );
    }

    const { status } = req.body;

    switch (status) {
      case "processed":
        if (transaction.status !== "pending") {
          throw new Error("Tidak dapat mengubah status transaksi.");
        }
        if (req.user.id !== transaction.sellerId) {
          throw new Error(
            "Proses transaksi hanya dapat dilakukan oleh penjual."
          );
        }
        break;
      case "completed":
        if (transaction.status !== "processed") {
          throw new Error("Tidak dapat mengubah status transaksi.");
        }
        if (req.user.id !== transaction.userId) {
          throw new Error(
            "Menyelesaikan transaksi hanya dapat dilakukan oleh pembeli."
          );
        }

        // Increment sales counter
        await Promise.all(
          transaction.items.map(async (item) => {
            const totalSales = item.product.sales + item.qty;

            await models.Product.update(
              { sales: totalSales },
              { where: { id: item.product.id } }
            );
          })
        );

        break;

      case "canceled":
        if (transaction.status === "completed") {
          throw new Error("Tidak dapat mengubah status transaksi.");
        }
        break;
    }

    const result = await transaction.update({ status });

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
