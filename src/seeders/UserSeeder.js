const bcrypt = require("bcrypt");
const User = require("../models/User");

const UserSeeder = async () => {
  /**
   * User Seeder
   */

  await User.bulkCreate([
    {
      username: "admin",
      name: "Admin",
      password: bcrypt.hashSync("123", 10),
      role: "admin",
    },
    {
      username: "konsultan",
      name: "Konsultan",
      password: bcrypt.hashSync("123", 10),
      role: "consultant",
      photo: "images/photos/photo-1614289371518-722f2615943d.jpg",
    },
    {
      username: "user",
      name: "User",
      password: bcrypt.hashSync("123", 10),
      role: "user",
      photo: "images/photos/photo-1603415526960-f7e0328c63b1.jpg",
    },
    {
      username: "user2",
      name: "User2",
      password: bcrypt.hashSync("123", 10),
      role: "user",
    },
  ]);
};

module.exports = UserSeeder;
