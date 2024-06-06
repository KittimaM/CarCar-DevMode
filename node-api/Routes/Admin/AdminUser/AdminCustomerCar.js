var express = require("express");
const {
  AdminGetAllCustomerCar,
  AdminAddCustomerCar,
  AdminUpdateCustomerCar,
  AdminDeleteCustomerCar,
} = require("../../../Controller/Admin/AdminUser/AdminCustomerCar");
var router = express.Router();

router.get("/", AdminGetAllCustomerCar);
router.post("/", AdminAddCustomerCar);
router.put("/", AdminUpdateCustomerCar);
router.delete("/", AdminDeleteCustomerCar);

module.exports = router;
