var express = require("express");
const {
  AdminUser,
  AdminAddStaffUser,
  AdminDeleteStaffUser,
  AdminUpdateStaffUser,
} = require("../../../Controller/Admin/AdminUser/AdminUser");
var router = express.Router();

router.get("/", AdminUser);
router.post("/", AdminAddStaffUser);
router.delete("/", AdminDeleteStaffUser);
router.put("/", AdminUpdateStaffUser);

module.exports = router;
