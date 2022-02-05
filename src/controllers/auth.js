const bcrypt = require("bcrypt");
const { Op } = require("../services/database");
const response = require("../services/response");
const User = require("../models/User");
const { generateJwt } = require("../services/jwt");

/**
 * Auth Login
 */
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      where: { [Op.or]: { username, email: username, phone: username } },
      attributes: { include: "password" },
    });

    if (!user) {
      throw new Error("User tidak ditemukan!");
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      throw new Error("Password salah!");
    }

    const authToken = generateJwt(user);
    const result = {
      token: authToken,
      user: { ...user.get(), password: undefined },
    };

    return response.success(res, result);
  } catch (err) {
    return response.error(res, err.message);
  }
};

const validate = async (req, res) => {
  return response.success(res, req.user);
};

const register = async (req, res) => {
  try {
    const { username, name, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const data = {
      username,
      name,
      password: passwordHash,
      role: "user",
    };

    const user = await User.create(data);

    const authToken = generateJwt(user);
    const result = {
      token: authToken,
      user: { ...user.get(), password: undefined },
    };

    return response.success(res, result);
  } catch (err) {
    return response.error(res, err.message);
  }
};

module.exports = {
  login,
  validate,
  register,
};
