var express = require("express");
const {
  PostAddPaymentType,
  GetAllPaymentType,
  PutUpdatePaymentType,
  DeletePaymentType,
} = require("../../../Controller/Admin/MasterData/PaymentTypeApi");
var router = express.Router();

router.post("/", PostAddPaymentType);
router.get("/", GetAllPaymentType);
router.put("/", PutUpdatePaymentType);
router.delete("/", DeletePaymentType);

module.exports = router;
