const bcrypt = require("bcrypt");
const { Op } = require("../services/database");
const response = require("../services/response");
const { models } = require("../models");
const { generateJwt } = require("../services/jwt");

const { OAuth2Client } = require("google-auth-library");
const CLIENT_ID =
  "210385753050-a2rr5r7hm1ic5jptn4s0e59lod4gp62d.apps.googleusercontent.com";
const googleClient = new OAuth2Client(CLIENT_ID);

/**
 * Auth Login
 */
const login = async (req, res) => {
  try {
    const { username, password, googleToken } = req.body;
    let user;

    if (!googleToken) {
      user = await models.User.findOne({
        where: { [Op.or]: { username, email: username, phone: username } },
        attributes: { include: "password" },
      });
    } else {
      const ticket = await googleClient.verifyIdToken({
        idToken: googleToken,
        audience: CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const googleId = payload.sub;

      user = await models.User.findOne({
        where: { googleId },
      });

      if (!user) {
        const emailExist = await models.User.findOne({
          where: { email: payload.email },
        });

        if (emailExist) {
          await emailExist.update({ email: "" });
        }

        const username = payload.email.split("@")[0];
        console.log(payload.email);
        const data = {
          googleId,
          username: username,
          email: payload.email,
          name: payload.name,
          photo: payload.picture,
          password: "",
          role: "user",
        };
        console.log(data);

        // Register google account
        const newUser = await models.User.create(data);
        user = await models.User.findByPk(newUser.id);
      }
    }

    if (!user) {
      throw new Error("User tidak ditemukan!");
    }

    const checkPassword = googleToken
      ? true
      : await bcrypt.compare(password, user.password);

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

    const user = await models.User.create(data);

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
  register,
};
