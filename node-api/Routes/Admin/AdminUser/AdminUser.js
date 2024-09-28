var express = require("express");
const {
  AdminUser,
  AdminAddStaffUser,
  AdminDeleteStaffUser,
  AdminUpdateStaffUser,
  AdminActiveStaff,
  AdminUnlockStaff,
} = require("../../../Controller/Admin/AdminUser/AdminUser");
var router = express.Router();

router.get("/", AdminUser);
router.post("/", AdminAddStaffUser);
router.delete("/", AdminDeleteStaffUser);
router.put("/", AdminUpdateStaffUser);
router.put("/active-user", AdminActiveStaff);
router.put("/unlock-user", AdminUnlockStaff);

module.exports = router;
