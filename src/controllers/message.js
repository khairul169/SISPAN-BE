const { Op, literal } = require("../services/database");
const response = require("../services/response");
const { models, insertOrUpdate } = require("../models");

const LATEST_MESSAGE_QUERY =
  "(SELECT message FROM `messages` m \
    WHERE (m.userId = `message_box`.`userId` OR m.userId = `message_box`.`recipientId`) \
    AND (m.fromId = `message_box`.`userId` OR m.fromId = `message_box`.`recipientId`) \
    ORDER BY m.id DESC LIMIT 1)";

const getAll = async (req, res) => {
  try {
    const userId = req.user.id;

    // const result = await models.Message.findAll({
    //   where: { userId },
    //   attributes: {
    //     exclude: ["message"],
    //     include: [[literal(LATEST_MESSAGE_QUERY), "message"]],
    //   },
    //   include: [{ model: models.User }, { model: models.User, as: "from" }],
    //   group: ["fromId"],
    //   order: [["createdAt", "desc"]],
    // });

    const result = await models.MessageBox.findAll({
      where: { userId },
      include: { model: models.User, as: "recipient" },
      attributes: {
        include: [[literal(LATEST_MESSAGE_QUERY), "message"]],
      },
      order: [["updatedAt", "DESC"]],
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

    const result = await models.Message.findAll({
      where: {
        userId: { [Op.or]: [userId, targetId] },
        fromId: { [Op.or]: [userId, targetId] },
        id: { [Op.gt]: lastId },
      },
      include: [{ model: models.User }, { model: models.User, as: "from" }],
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

    const result = await models.Message.create(data);

    await insertOrUpdate(
      models.MessageBox,
      { userId: data.fromId, recipientId: data.userId },
      { updatedAt: Date.now() }
    );

    await insertOrUpdate(
      models.MessageBox,
      { userId: data.userId, recipientId: data.fromId },
      { updatedAt: Date.now() }
    );

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
