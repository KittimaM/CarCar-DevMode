var express = require("express");
const {
  GetGeneralSetting,
  UpdateGeneralSetting,
} = require("../../../Controller/Admin/Setting/AdminGeneral");

var router = express.Router();

router.get("/", GetGeneralSetting);
router.put("/", UpdateGeneralSetting);

module.exports = router;
