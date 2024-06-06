var express = require("express");
const {
  AdminGetAllOnLeaveType,
  AdminDeleteOnLeaveType,
  AdminUpdateOnLeaveType,
  AdminAddOnLeaveType,
} = require("../../Controller/Admin/AdminOnLeaveType");

var router = express.Router();

router.get("/", AdminGetAllOnLeaveType);
router.delete("/", AdminDeleteOnLeaveType);
router.put("/", AdminUpdateOnLeaveType);
router.post("/", AdminAddOnLeaveType);

module.exports = router;
