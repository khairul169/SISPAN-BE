const fs = require("fs");
const path = require("path");
const multer = require("multer");
const sharp = require("sharp");

const upload = (destPath, prefix) => {
  return multer({
    storage: multer.diskStorage({
      destination: destPath,
      filename: function (_, file, cb) {
        cb(null, `${prefix}-` + Date.now() + path.extname(file.originalname));
      },
    }),
    limits: {
      fileSize: 10240 * 1000,
      fieldSize: 25 * 1024 * 1024,
    },
    fileFilter: function (_, file, cb) {
      const filetypes = /jpeg|jpg|png/;
      const extname = filetypes.test(
        path.extname(file.originalname).toLowerCase()
      );
      const mimetype = filetypes.test(file.mimetype);

      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb("Error: Images Only!");
      }
    },
  });
};

const compress = (resize) => async (req, _, next) => {
  if (!req.files?.length) {
    return next();
  }

  const promises = req.files.map(async (file) => {
    const buffer = await sharp(file.path)
      .resize(resize?.width || 1024, resize?.height, {
        fit: resize != null ? "cover" : "contain",
      })
      .flatten({ background: "#ffffff" })
      .jpeg({ mozjpeg: true, quality: 90 })
      .toBuffer();

    return new Promise((resolve) => {
      fs.writeFile(file.path, buffer, resolve);
    });
  });

  await Promise.all(promises);
  next();
};

module.exports = {
  upload,
  compress,
};
