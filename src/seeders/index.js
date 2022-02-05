const bcrypt = require("bcrypt");
const Product = require("../models/Product");
const ProductCategory = require("../models/ProductCategory");
const User = require("../models/User");

const seed = async () => {
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

  /**
   * Product Seeder
   */

  await ProductCategory.bulkCreate([
    { name: "Bahan Pangan" }, // 1
    { name: "Bibit" }, // 2
    { name: "Pupuk" }, // 3
    { name: "Perlengkapan" }, // 4
  ]);

  await Product.bulkCreate([
    {
      userId: 3,
      categoryId: 1,
      name: "Sawi Super",
      image: "images/products/sawi.png",
      price: 5000,
      description:
        "Jual beras unggul bermutu tinggi dipanen dengan mesin super canggih. Dirawat dan dibesarkan dengan kasih sayang sehinggamenghasilkan produk berkhasiat tinggi bagi tubuh kita.",
    },
    {
      userId: 3,
      categoryId: 1,
      name: "Kacang Panjang Mantep",
      image: "images/products/kacang.png",
      price: 7000,
      description: "Ini Kacang Panjang Mantep",
    },
    {
      userId: 3,
      categoryId: 1,
      name: "Terong Gede",
      image: "images/products/terong.png",
      price: 9000,
      description: "Ini Terong Gede",
    },
    {
      userId: 4,
      categoryId: 2,
      name: "Benih Sawi Uwogh",
      image: "images/products/benih_sawi.png",
      price: 15000,
      description: "Ini Benih Sawi Uwogh",
    },
    {
      userId: 3,
      categoryId: 1,
      name: "Jagung Markotop",
      image: "images/products/jagung.png",
      price: 12000,
      description: "Ini Jagung Markotop",
    },
    {
      userId: 4,
      categoryId: 3,
      name: "Beras Mantul",
      image: "images/products/beras.png",
      price: 78000,
      description: "Ini Beras Mantul",
    },
  ]);
};

module.exports = seed;
