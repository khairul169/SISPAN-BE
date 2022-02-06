const bcrypt = require("bcrypt");
const { sequelize, col, literal, Op } = require("../services/database");
const response = require("../services/response");
const User = require("../models/User");
const { models, insertOrUpdate } = require("../models");
const { haversine, sanitizeObject } = require("../services/utils");

const getUser = async (req, res) => {
  return response.success(res, req.user);
};

const getById = async (req, res) => {
  try {
    const { userId } = req.params;
    const { latitude, longitude } = req.query;

    const locationDistanceAttr = [];
    if (latitude && longitude) {
      locationDistanceAttr.push(haversine(latitude, longitude));
    }

    const result = await models.User.findByPk(userId || 0, {
      include: {
        model: models.UserLocation,
        as: "location",
        attributes: { include: locationDistanceAttr },
      },
    });

    return response.success(res, result);
  } catch (err) {
    return response.error(res, err.message);
  }
};

const search = async (req, res) => {
  try {
    const { query } = req;
    const criteria = { id: { [Op.not]: req.user.id } };
    const order = [];

    if (query.role) {
      criteria.role = query.role;
    }

    if (query.nearest) {
      order.unshift([literal("`location.distance`"), "ASC"]);
    }

    const result = await User.findAll({
      where: criteria,
      order: query.random ? sequelize.random() : [...order, ["name", "ASC"]],
      limit: parseInt(query.limit, 10) || 10,
      include: {
        model: models.UserLocation,
        as: "location",
        attributes: { include: [haversine(query.latitude, query.longitude)] },
        required: query.nearest != null,
      },
    });

    return response.success(res, result);
  } catch (err) {
    return response.error(res, err.message);
  }
};

// const create = async (req, res) => {
//   try {
//     const { username, name, password, email, phone, role } = req.body;

//     const passwordHash = await bcrypt.hash(password, 10);

//     const data = {
//       username,
//       name,
//       password: passwordHash,
//       email,
//       phone,
//       role: role || "user",
//     };

//     const user = await User.create(data);
//     const result = { ...user.get(), password: undefined };

//     return response.success(res, result);
//   } catch (err) {
//     return response.error(res, err.message);
//   }
// };

const update = async (req, res) => {
  try {
    let user = req.user;

    if (user.isAdmin) {
      user = await User.findByPk(req.params.userId || req.user.id);
    }

    if (!user) {
      throw new Error("Cannot find user!");
    }

    const { username, name, password, email, phone, role, location } = req.body;

    const data = sanitizeObject({
      username,
      name,
      email,
      phone,
      role: req.user.isAdmin ? role : null,
      location,
    });

    if (password?.length) {
      data.password = await bcrypt.hash(password, 10);
    }

    // Update user data
    await user.update(data);

    // Update user location
    if (data.location) {
      const { latitude, longitude, address } = data.location;

      await insertOrUpdate(
        models.UserLocation,
        { userId: user.id },
        { latitude, longitude, address }
      );
    }

    return response.success(res, true);
  } catch (err) {
    return response.error(res, err.message);
  }
};

module.exports = {
  getUser,
  getById,
  search,
  // create,
  update,
};
