const { Op } = require("../services/database");
const response = require("../services/response");
const User = require("../models/User");
const Message = require("../models/Message");

const getAll = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await Message.findAll({
      where: { userId },
      include: [{ model: User }, { model: User, as: "from" }],
      group: ["fromId"],
      order: [["createdAt", "desc"]],
    });

    return response.success(res, result);
  } catch (err) {
    return response.error(res, err.message);
  }
};

const getMessages = async (req, res) => {
  try {
    const userId = req.user.id;
    const targetId = req.params.userId || 0;
    const lastId = req.query.lastId || 0;

    const result = await Message.findAll({
      where: {
        userId: { [Op.or]: [userId, targetId] },
        fromId: { [Op.or]: [userId, targetId] },
        id: { [Op.gt]: lastId },
      },
      include: [{ model: User }, { model: User, as: "from" }],
      order: [["createdAt", "desc"]],
    });

    return response.success(res, result);
  } catch (err) {
    return response.error(res, err.message);
  }
};

const create = async (req, res) => {
  try {
    const { to, message } = req.body;

    const data = {
      fromId: req.user.id,
      userId: to,
      message,
    };

    const result = await Message.create(data);

    return response.success(res, result);
  } catch (err) {
    return response.error(res, err.message);
  }
};

module.exports = {
  getAll,
  getMessages,
  create,
};
