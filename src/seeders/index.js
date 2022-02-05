const bcrypt = require("bcrypt");
const User = require("../models/User");

const seed = async () => {
  /**
   * User seeder
   */

  const users = [
    {
      username: "admin",
      name: "Admin",
      password: bcrypt.hashSync("123", 10),
      role: "admin",
    },
    {
      username: "user",
      name: "User",
      password: bcrypt.hashSync("123", 10),
      role: "user",
    },
  ];

  await User.bulkCreate(users);
};

module.exports = seed;
