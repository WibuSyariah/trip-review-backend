const multer = require("multer");
const path = require("path");
const AppError = require("../helpers/appError");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `uploads/images`);
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    cb(null, `${Date.now()}${fileExtension}`);
  },
});

const fileUpload = multer({
  storage: fileStorage,
  limits: {
    fileSize: 2000000, //2mb
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg|pdf)$/)) {
      return cb(
        new AppError("File must be .jpg or .jpeg or .png  or.pdf", 400),
      );
    }
    cb(undefined, true);
  },
});

module.exports = fileUpload;
