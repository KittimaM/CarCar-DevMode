const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { randomUUID } = require("crypto");

const UPLOAD_DIR = path.resolve(__dirname, "..", "uploads", "payment-qr");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const ext = (file.mimetype && file.mimetype.split("/")[1]) || "png";
    cb(null, `${randomUUID()}.${ext}`);
  },
});

const uploadPaymentQr = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /^image\/(jpeg|jpg|png|gif|webp)$/;
    if (allowed.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
}).single("qr_code");

module.exports = uploadPaymentQr;
