var express = require("express");
const {
  AdminAddTemplate,
  AdminGetAllTemplate,
  AdminDeleteTemplate,
  AdminUpdateTemplate,
} = require("../../Controller/Admin/AdminTemplate");
var router = express.Router();

router.get("/", AdminGetAllTemplate);
router.post("/", AdminAddTemplate);
router.delete("/", AdminDeleteTemplate);
router.put("/", AdminUpdateTemplate);

module.exports = router;
