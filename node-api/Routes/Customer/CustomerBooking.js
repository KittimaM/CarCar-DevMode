var express = require("express");
const {
  CustomerBooking,
  CustomerGetServiceChoice,
  CustomerGetAllBooking,
  CustomerDeleteBooking,
  GetBranches,
  GetChannelsByBranch,
  GetChannelOpenDays,
  GetServiceRatesByCarSize,
  GetAvailableSlots,
} = require("../../Controller/Customer/CustomerBooking");
var router = express.Router();

router.get("/branches", GetBranches);
router.get("/channels", GetChannelsByBranch);
router.get("/open-days", GetChannelOpenDays);
router.get("/service-rates", GetServiceRatesByCarSize);
router.post("/available-slots", GetAvailableSlots);
router.post("/", CustomerBooking);
router.post("/service", CustomerGetServiceChoice);
router.get("/", CustomerGetAllBooking);
router.delete("/", CustomerDeleteBooking);

module.exports = router;
