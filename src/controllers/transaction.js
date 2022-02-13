const { models } = require("../models");
const { sanitizeObject, pageFilter } = require("../services/utils");
const { pushNotification } = require("../services/push-notification");
const response = require("../services/response");
const { Op, literal } = require("../services/database");
const { transactionStatus } = require("../models/Transaction");

const getAll = async (req, res) => {
  try {
    const { query } = req;
    const { offset, limit } = pageFilter(query);

    // Item filter
    const filter = sanitizeObject({
      no: query.no ? { [Op.like]: `%${query.no}%` } : null,
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

    if (!req.user.isAdmin) {
      filter[Op.or] = [{ userId: req.user.id }, { sellerId: req.user.id }];
    }

    const transactionList = await models.Transaction.findAndCountAll({
      where: filter,
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

    if (!req.user.isAdmin && transaction.status === "canceled") {
      throw new Error(
        "Tidak dapat mengubah status transaksi yang telah dibatalkan."
      );
    }

    const { status } = req.body;
    let pushMsg;

    if (!req.user.isAdmin) {
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

          pushMsg = `Pesanan anda dengan nomor #${transaction.no} telah diproses oleh penjual.`;
          pushNotification(transaction.userId, pushMsg);
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

          pushMsg = `Transaksi dengan nomor #${transaction.no} telah dinyatakan selesai oleh pembeli.`;
          pushNotification(transaction.sellerId, pushMsg);
          break;

        case "canceled":
          if (transaction.status === "completed") {
            throw new Error("Tidak dapat mengubah status transaksi.");
          }

          pushMsg = `Transaksi #${transaction.no} telah dibatalkan.`;
          pushNotification([transaction.userId, transaction.sellerId], pushMsg);
          break;
      }
    }

    const result = await transaction.update({ status });

    return response.success(res, result);
  } catch (err) {
    return response.error(res, err.message);
  }
};

const destroy = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      throw new Error("Unauthorized!");
    }

    const transaction = await models.Transaction.findByPk(req.params.id || 0);
    if (!transaction) {
      throw new Error("Transaction not found!");
    }

    await transaction.destroy();

    return response.success(res, true);
  } catch (err) {
    return response.error(res, err.message);
  }
};

module.exports = {
  getAll,
  getTransaction,
  update,
  destroy,
};
