var express = require("express");
const {
  AdminBooking,
  AdminAddBooking,
  AdminUpdateStatusBooking,
} = require("../../Controller/Admin/AdminBooking");
var router = express.Router();

router.get("/", AdminBooking);
router.post("/", AdminAddBooking);
router.post("/update-status", AdminUpdateStatusBooking);

module.exports = router;