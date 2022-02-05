const bcrypt = require("bcrypt");
const { sequelize } = require("../services/database");
const response = require("../services/response");
const User = require("../models/User");

const getUser = async (req, res) => {
  return response.success(res, req.user);
};

const search = async (req, res) => {
  try {
    const { query } = req;
    const criteria = {};

    if (query.role) {
      criteria.role = query.role;
    }

    const result = await User.findAll({
      where: criteria,
      order: query.random ? sequelize.random() : [["name", "ASC"]],
      limit: parseInt(query.limit, 10) || 10,
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
    const user = await User.findByPk(req.params.userId || 0);

    if (!user) {
      throw new Error("Cannot find user!");
    }

    const { username, name, password, email, phone, role } = req.body;

    const data = {
      username,
      name,
      email,
      phone,
      role,
    };

    if (password?.length) {
      data.password = await bcrypt.hash(password, 10);
    }

    await user.update(data);
    const result = { ...user.get(), password: undefined };

    return response.success(res, result);
  } catch (err) {
    return response.error(res, err.message);
  }
};

module.exports = {
  getUser,
  search,
  // create,
  update,
};
