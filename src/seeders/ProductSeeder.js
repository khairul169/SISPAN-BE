const Product = require("../models/Product");
const ProductCategory = require("../models/ProductCategory");

const ProductSeeder = async () => {
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

module.exports = ProductSeeder;
