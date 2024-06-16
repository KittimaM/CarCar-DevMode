var express = require("express");
const {
  AdminGetLatestOnLeaveByType,
  AdminGetLatestOnLeaveByTypeAndStaffId,
} = require("../../../Controller/Admin/AdminOnLeave/AdminOnLeaveDetail");
var router = express.Router();

router.get("/latest/personal", AdminGetLatestOnLeaveByType);
router.get("/latest/list", AdminGetLatestOnLeaveByTypeAndStaffId)

module.exports = router;
