var express = require("express");
const {
  PostWalkInServices,
  AdminBooking,
  AdminAddBooking,
  AdminUpdateStatusBooking,
} = require("../../Controller/Admin/Booking/AdminBooking");
var router = express.Router();

router.get("/", AdminBooking);
router.post("/walk-in-services", PostWalkInServices);
router.post("/", AdminAddBooking);
router.post("/update-status", AdminUpdateStatusBooking);

module.exports = router;