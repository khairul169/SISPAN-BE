const bcrypt = require("bcrypt");
const { sequelize, col, literal, Op } = require("../services/database");
const response = require("../services/response");
const User = require("../models/User");
const { models, insertOrUpdate } = require("../models");
const { haversine, sanitizeObject, pageFilter } = require("../services/utils");

// const getUser = async (req, res) => {
//   return response.success(res, req.user);
// };

const getById = async (req, res) => {
  try {
    const { userId } = req.params;
    const { latitude, longitude } = req.query;

    const locationDistanceAttr = [];
    if (latitude && longitude) {
      locationDistanceAttr.push(haversine(latitude, longitude));
    }

    const result = await models.User.findByPk(userId || req.user.id, {
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
    const { offset, limit } = pageFilter(query);
    const criteria = !req.user.isAdmin ? { id: { [Op.not]: req.user.id } } : {};
    const order = [];

    if (query.name) {
      const rules = { [Op.like]: `%${query.name}%` };
      criteria[Op.or] = [
        { name: rules },
        { phone: rules },
        { email: rules },
        { username: rules },
      ];
    }

    if (query.role) {
      criteria.role = query.role;
    }

    if (query.nearest) {
      order.unshift([literal("`location.distance`"), "ASC"]);
    }

    const options = {
      where: criteria,
      order: query.random ? sequelize.random() : [...order, ["name", "ASC"]],
      offset,
      limit,
      include: {
        model: models.UserLocation,
        as: "location",
        attributes: {
          include: query.nearest
            ? [haversine(query.latitude, query.longitude)]
            : null,
        },
        required: query.nearest != null,
      },
    };

    let result;

    if (query.limit) {
      result = await User.findAndCountAll(options);
    } else {
      result = await User.findAll(options);
    }

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

    const {
      username,
      name,
      password,
      email,
      phone,
      role,
      signature,
      location,
    } = req.body;

    const data = sanitizeObject({
      username,
      name,
      email,
      phone,
      role: req.user.isAdmin && user.id !== 1 ? role : null,
      signature,
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

const destroy = async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      throw new Error("Access denied!");
    }

    const user = await User.findByPk(req.params.userId || 0);

    if (user.id === 1) {
      throw new Error("Cannot delete super admin!");
    }

    if (!user) {
      throw new Error("Cannot find user!");
    }

    // Update user data
    await user.destroy();

    return response.success(res, true);
  } catch (err) {
    return response.error(res, err.message);
  }
};

module.exports = {
  // getUser,
  getById,
  search,
  // create,
  update,
  destroy,
};
