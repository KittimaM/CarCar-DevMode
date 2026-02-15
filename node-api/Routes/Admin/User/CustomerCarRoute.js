var express = require("express");
const {
  GetAllCustomerCar,
  PostAddCustomerCar,
  PutUpdateCustomerCar,
  DeleteCustomerCar,
} = require("../../../Controller/Admin/User/CustomerCarApi");
var router = express.Router();

router.get("/", GetAllCustomerCar);
router.post("/", PostAddCustomerCar);
router.put("/", PutUpdateCustomerCar);
router.delete("/", DeleteCustomerCar);

module.exports = router;
