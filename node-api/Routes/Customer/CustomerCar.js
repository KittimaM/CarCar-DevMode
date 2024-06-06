var express = require("express");
const {
  CustomerCar,
  CustomerAddCustomerCar,
  CustomerDeleteCustomerCar,
  CustomerUpdateCustomerCar,
} = require("../../Controller/Customer/CustomerCar");
var router = express.Router();

router.get("/", CustomerCar);
router.post("/", CustomerAddCustomerCar);
router.delete("/", CustomerDeleteCustomerCar);
router.put("/", CustomerUpdateCustomerCar);

module.exports = router;
