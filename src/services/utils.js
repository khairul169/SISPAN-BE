const fs = require("fs");
const crypto = require("crypto");

const sanitizeObject = (obj) => {
  const object = { ...obj };
  for (let key in object) {
    if (object[key] == null) {
      delete object[key];
    }
  }
  return object;
};

const pageFilter = (query) => {
  const curPage = parseInt(query.page, 10) || 1;
  const pageSize = parseInt(query.limit, 10) || 20;
  const offset = (curPage - 1) * pageSize;
  const limit = pageSize;
  return { curPage, pageSize, offset, limit };
};

// Format phone number
const sanitizeNumber = (no) => {
  let number = no.replace(/([^0-9])/g, "");
  if (number.startsWith("08")) {
    number = number.substring(1);
  }
  if (!number.startsWith("62")) {
    number = `62${number}`;
  }
  return number;
};

const storeMedia = (data) => {
  const base64Data = data.substr(data.indexOf(",") + 1);
  const buffer = Buffer.from(base64Data, "base64");
  const baseDir = __dirname + "/../../public/media";
  const id = crypto.randomBytes(10).toString("hex");
  const time = new Date();
  const filename = `${id}-${time.getMilliseconds()}.png`;

  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir);
  }

  fs.writeFileSync(`${baseDir}/${filename}`, buffer);
  return filename;
};

module.exports = {
  sanitizeObject,
  pageFilter,
  sanitizeNumber,
  storeMedia,
};
