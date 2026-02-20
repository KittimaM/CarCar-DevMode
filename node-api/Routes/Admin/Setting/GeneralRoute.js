var express = require("express");
const {
  GetGeneralSetting,
  PutUpdateGeneralSetting,
} = require("../../../Controller/Admin/Setting/GeneralApi");

var router = express.Router();

router.get("/", GetGeneralSetting);
router.put("/", PutUpdateGeneralSetting);

module.exports = router;
