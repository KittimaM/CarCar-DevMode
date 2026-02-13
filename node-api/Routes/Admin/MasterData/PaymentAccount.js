var express = require("express");
const {
  GetAllPaymentAccount,
  PostAddPaymentAccount,
  PutUpdatePaymentAccount,
  UpdatePaymentAccountAvailable,
  DeletePaymentAccount,
} = require("../../../Controller/Admin/MasterData/PaymentAccount");
const uploadPaymentQr = require("../../../Middleware/uploadPaymentQr");

var router = express.Router();

const handleUpload = (req, res, next) => {
  uploadPaymentQr(req, res, (err) => {
    if (err) {
      return res.json({ status: "ERROR", msg: err.message || "Upload failed" });
    }
    next();
  });
};

router.get("/", GetAllPaymentAccount);
router.post("/", handleUpload, PostAddPaymentAccount);
router.put("/", handleUpload, PutUpdatePaymentAccount);
router.put("/is-available", UpdatePaymentAccountAvailable);
router.delete("/", DeletePaymentAccount);

module.exports = router;
