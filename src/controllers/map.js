const axios = require("axios").default;
const response = require("../services/response");

const getAddress = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    const baseUrl = "https://us1.locationiq.com/v1/reverse.php";
    const params = {
      key: process.env.LOCATIONIQ_KEY,
      format: "json",
      lat: latitude,
      lon: longitude,
    };

    const { data } = await axios.get(baseUrl, { params });
    const result = {
      address: data.display_name,
      details: data.address,
    };

    return response.success(res, result);
  } catch (err) {
    return response.error(res, err.message);
  }
};

module.exports = {
  getAddress,
};
