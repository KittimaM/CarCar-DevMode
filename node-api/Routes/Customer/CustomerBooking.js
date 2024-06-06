var express = require("express");
const {
  CustomerBooking,
  CustomerGetServiceChoice,
  CustomerGetAllBooking,
  CustomerDeleteBooking,
} = require("../../Controller/Customer/CustomerBooking");
var router = express.Router();

router.post("/", CustomerBooking);
router.post("/service", CustomerGetServiceChoice);
router.get("/", CustomerGetAllBooking);
router.delete("/", CustomerDeleteBooking);

module.exports = router;
