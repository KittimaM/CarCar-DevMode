var express = require("express");
const {
  GetBranches,
  PostGetServiceRatesByCarSize,
} = require("../../Controller/Customer/CustomerBooking");
var router = express.Router();

router.get("/branches", GetBranches);
router.post("/service-rates", PostGetServiceRatesByCarSize);

// TODO: uncomment when controller functions are ready
// router.get("/channels", GetChannelsByBranch);
// router.get("/open-days", GetChannelOpenDays);
// router.post("/available-slots", GetAvailableSlots);
// router.post("/", CustomerBooking);
// router.post("/service", CustomerGetServiceChoice);
// router.get("/", CustomerGetAllBooking);
// router.delete("/", CustomerDeleteBooking);

module.exports = router;
