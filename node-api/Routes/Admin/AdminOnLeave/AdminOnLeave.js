var express = require("express");
const {
  AdminGetAllOnLeave,
  AdminAddOnLeave,
  AdminDeleteOnLeave,
  AdminApproveOnLeave,
  AdminGetOnLeavePersonal,
  AdminAddOnLeavePersonal,
} = require("../../../Controller/Admin/AdminOnLeave/AdminOnLeave");

var router = express.Router();

router.get("/", AdminGetAllOnLeave);
router.post("/", AdminAddOnLeave);
router.delete("/", AdminDeleteOnLeave);
router.put("/approve", AdminApproveOnLeave);

//personal
router.get("/personal", AdminGetOnLeavePersonal);
router.post("/personal", AdminAddOnLeavePersonal);

module.exports = router;
