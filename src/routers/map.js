const map = require("../controllers/map");

module.exports = (router) => {
  // Map
  router.get("/map/address", map.getAddress);
};
