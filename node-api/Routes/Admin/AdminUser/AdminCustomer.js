var express = require("express");
const {
  AdminGetAllCustomer,
  AdminAddCustomer,
  AdminUpdateCustomer,
  AdminDeleteCustomer,
  AdminUnlockCustomer,
  GetCustomerUserById,
} = require("../../../Controller/Admin/AdminUser/AdminCustomer");
var router = express.Router();

router.get("/", AdminGetAllCustomer);
router.post("/", AdminAddCustomer);
router.put("/", AdminUpdateCustomer);
router.delete("/", AdminDeleteCustomer);
router.put("/unlock-user", AdminUnlockCustomer);
router.post("/id", GetCustomerUserById);

module.exports = router;
