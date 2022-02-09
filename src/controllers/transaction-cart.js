const { models } = require("../models");
const { clamp, arrayGroupBy } = require("../services/utils");
const response = require("../services/response");
const { col, sequelize } = require("../services/database");

const getItems = async (req, res) => {
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
      // raw: true,
      // nest: true,
    });

    const plainRows = items.rows.map((el) => el.get({ plain: true }));
    const total = plainRows.reduce((sum, item) => {
      return sum + item.product.price * item.qty;
    }, 0);

    let rows = arrayGroupBy(plainRows, "sellerId");
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

const store = async (req, res) => {
  try {
    const { product } = req.body;

    const data = {
      userId: req.user.id,
      productId: product,
    };

    const productData = await models.Product.findByPk(product, {
      attributes: ["userId"],
    });

    if (productData.userId === data.userId) {
      throw new Error("Tidak dapat menambahkan produk milik pribadi!");
    }

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

const update = async (req, res) => {
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

const destroy = async (req, res) => {
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

const checkout = async (req, res) => {
  const tx = await sequelize.transaction();

  try {
    const cartResult = await models.TransactionCart.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: models.Product,
          required: true,
          attributes: ["price", "sales"],
          include: { model: models.User, attributes: ["id"] },
        },
      ],
      attributes: { include: [[col("product.userId"), "sellerId"]] },
      order: [["id", "DESC"]],
      raw: true,
      nest: true,
    });

    let group = arrayGroupBy(cartResult, "sellerId");
    group = Object.values(group).map((item) => {
      return {
        user: item[0].product.user,
        total: item.reduce((sum, i) => {
          return sum + i.product.price * i.qty;
        }, 0),
        items: item,
      };
    });

    const result = { id: null };

    await Promise.all(
      group.map(async (cart) => {
        // Create transaction data
        const transaction = await models.Transaction.create(
          {
            userId: req.user.id,
            sellerId: cart.user.id,
            total: cart.total,
            charge: 0,
            discount: 0,
            grandTotal: cart.total,
            status: "pending",
          },
          { transaction: tx }
        );

        if (!result.id) {
          result.id = transaction.id;
        }

        await Promise.all(
          cart.items.map(async (item) => {
            // Add transaction items
            await models.TransactionItem.create(
              {
                transactionId: transaction.id,
                productId: item.productId,
                price: item.product.price,
                qty: item.qty,
              },
              { transaction: tx }
            );

            // Increment sales counter
            // const totalSales = item.product.sales + item.qty;
            // await models.Product.update(
            //   { sales: totalSales },
            //   { where: { id: item.productId }, transaction: tx }
            // );

            // Remove from user cart
            await models.TransactionCart.destroy({
              where: { id: item.id },
              transaction: tx,
            });
          })
        );
      })
    );

    await tx.commit();

    return response.success(res, result);
  } catch (err) {
    await tx.rollback();
    return response.error(res, err.message);
  }
};

module.exports = {
  getItems,
  store,
  update,
  destroy,
  checkout,
};
