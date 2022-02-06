const { models } = require("../models");
const { clamp, arrayGroupBy } = require("../services/utils");
const response = require("../services/response");
const { col } = require("../services/database");

const getCartItems = async (req, res) => {
  try {
    const items = await models.TransactionCart.findAndCountAll({
      where: { userId: req.user.id },
      include: [
        {
          model: models.Product,
          required: true,
          include: models.User,
        },
      ],
      attributes: { include: [[col("product.userId"), "sellerId"]] },
      order: [["id", "DESC"]],
      raw: true,
      nest: true,
    });

    const total = items.rows.reduce((sum, item) => {
      return sum + item.product.price * item.qty;
    }, 0);

    let rows = arrayGroupBy(items.rows, "sellerId");
    rows = Object.values(rows).map((item) => {
      return {
        user: item[0].product.user,
        total: item.reduce((sum, i) => {
          return sum + i.product.price * i.qty;
        }, 0),
        items: item,
      };
    });

    const result = {
      count: items.count,
      items: rows,
      total,
      grandTotal: total,
    };

    return response.success(res, result);
  } catch (err) {
    return response.error(res, err.message);
  }
};

const putCartItem = async (req, res) => {
  try {
    const { product } = req.body;

    const data = {
      userId: req.user.id,
      productId: product,
    };

    const exist = await models.TransactionCart.findOne({ where: data });
    let result;

    if (exist) {
      result = await exist.update({ qty: exist.qty + 1 });
    } else {
      result = await models.TransactionCart.create(data);
    }

    return response.success(res, result);
  } catch (err) {
    return response.error(res, err.message);
  }
};

const updateCartItem = async (req, res) => {
  try {
    const item = await models.TransactionCart.findByPk(req.params.id || 0);
    if (!item) {
      throw new Error("Cart item not found!");
    }

    const { qty } = req.body;
    const itemQty = clamp(parseInt(qty), 1, 9999);

    const result = await item.update({
      qty: itemQty,
    });

    return response.success(res, result);
  } catch (err) {
    return response.error(res, err.message);
  }
};

const destroyCartItem = async (req, res) => {
  try {
    const item = await models.TransactionCart.findByPk(req.params.id || 0);
    if (!item) {
      throw new Error("Cart item not found!");
    }

    await item.destroy();

    return response.success(res, true);
  } catch (err) {
    return response.error(res, err.message);
  }
};

module.exports = {
  getCartItems,
  putCartItem,
  updateCartItem,
  destroyCartItem,
};
