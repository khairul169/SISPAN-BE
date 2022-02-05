const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const { JWT_SECRET, JWT_EXP } = process.env;

const useAuth = expressJwt({ secret: JWT_SECRET, algorithms: ["HS256"] });

const generateJwt = (user) => {
  const payload = { id: user?.id, role: user?.role };
  const authToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXP,
  });
  return authToken;
};

module.exports = {
  generateJwt,
  useAuth,
};
