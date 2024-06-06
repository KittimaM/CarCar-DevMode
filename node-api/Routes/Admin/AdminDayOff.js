var express = require("express");
const {
  AdminGetAllDayOff,
  AdminUpdateDayOff,
} = require("../../Controller/Admin/AdminDayOff");
var router = express.Router();

router.get("/", AdminGetAllDayOff);
router.put("/", AdminUpdateDayOff);

module.exports = router;
