var express = require("express");
const {
  AdminGetAllCustomer,
  AdminAddCustomer,
  AdminUpdateCustomer,
  AdminDeleteCustomer,
  AdminActiveCustomer,
  AdminUnlockCustomer,
} = require("../../../Controller/Admin/AdminUser/AdminCustomer");
var router = express.Router();

router.get("/", AdminGetAllCustomer);
router.post("/", AdminAddCustomer);
router.put("/", AdminUpdateCustomer);
router.delete("/", AdminDeleteCustomer);
router.put("/active-user", AdminActiveCustomer);
router.put("/unlock-user", AdminUnlockCustomer);

module.exports = router;
