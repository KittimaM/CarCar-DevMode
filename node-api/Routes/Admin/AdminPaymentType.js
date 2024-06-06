var express = require("express");
const {
  AdminAddPaymentType,
  AdminGetAllPaymentType,
  AdminUpdatePaymentType,
  AdminDeletePaymentType,
} = require("../../Controller/Admin/AdminPaymentType");
var router = express.Router();

router.post("/", AdminAddPaymentType);
router.get("/", AdminGetAllPaymentType);
router.put("/", AdminUpdatePaymentType);
router.delete("/", AdminDeletePaymentType);

module.exports = router;
