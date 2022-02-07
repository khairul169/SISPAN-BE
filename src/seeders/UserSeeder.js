const bcrypt = require("bcrypt");
const User = require("../models/User");
const UserLocation = require("../models/UserLocation");

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
    },
    {
      username: "mitra",
      name: "Mitra",
      password: bcrypt.hashSync("123", 10),
      photo: "images/photos/photo-1603415526960-f7e0328c63b1.jpg",
      role: "mitra",
      signature: "Penyedia Bibit",
    },
    {
      username: "mitra2",
      name: "Mitra2",
      password: bcrypt.hashSync("123", 10),
      photo: "images/photos/photo-1614289371518-722f2615943d.jpg",
      role: "mitra",
      signature: "Penyedia Alat Pertanian",
    },
    {
      username: "mitra3",
      name: "Mitra3",
      password: bcrypt.hashSync("123", 10),
      role: "mitra",
      signature: "Penyedia Bahan Pangan",
    },
  ]);

  await UserLocation.bulkCreate([
    {
      userId: 4,
      latitude: 0.87927,
      longitude: 108.982505,
      address: "VXHM+P26 Sijangkung, Kota Singkawang, Kalimantan Barat",
    },
    {
      userId: 5,
      latitude: 0.6039358,
      longitude: 109.188399,
      address: "Sijangkung, Singkawang Sel., Kota Singkawang, Kalimantan Barat",
    },
    {
      userId: 3,
      latitude: 0.2477643,
      longitude: 109.2809087,
      address:
        "68QM+J4G, Peniti Dalam I, Segedong, Kab. Mempawah, Kalimantan Barat",
    },
    {
      userId: 6,
      latitude: -0.0296433,
      longitude: 109.3399815,
      address:
        "Jl. Siam No.133, Benua Melayu Darat, Kec. Pontianak Sel., Kota Pontianak, Kalimantan Barat 78243",
    },
  ]);
};

module.exports = UserSeeder;
