const fs = require("fs");
const crypto = require("crypto");

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
  sanitizeNumber,
  storeMedia,
};
