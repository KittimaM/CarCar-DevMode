var express = require("express");
const {
  AdminGetGeneralSetting,
  AdminUpdateGeneralSetting,
} = require("../../Controller/Admin/AdminGeneralSetting");

var router = express.Router();

router.get("/", AdminGetGeneralSetting);
router.put("/", AdminUpdateGeneralSetting);

module.exports = router;
