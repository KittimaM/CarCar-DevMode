var express = require("express");
const {
  AdminGetAdvanceSetting,
  AdminUpdateAdvanceSetting,
} = require("../../Controller/Admin/AdminAdvanceSetting");

var router = express.Router();

router.get("/", AdminGetAdvanceSetting);
router.put("/", AdminUpdateAdvanceSetting);

module.exports = router;
