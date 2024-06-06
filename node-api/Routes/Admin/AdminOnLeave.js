var express = require("express");
const {
  AdminGetAllOnLeave,
  AdminAddOnLeave,
  AdminDeleteOnLeave,
  AdminUpdateOnLeave,
  AdminApproveOnLeave,
  AdminGetOnLeavePersonal,
  AdminAddOnLeavePersonal,
} = require("../../Controller/Admin/AdminOnLeave");

var router = express.Router();

router.get("/", AdminGetAllOnLeave);
router.post("/", AdminAddOnLeave);
router.delete("/", AdminDeleteOnLeave);
router.put("/", AdminUpdateOnLeave);
router.put("/approve", AdminApproveOnLeave);

//persona
router.get("/personal", AdminGetOnLeavePersonal);
router.post("/personal", AdminAddOnLeavePersonal);

module.exports = router;
