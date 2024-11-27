var express = require("express");
const {
  AdminAddTemplate,
  AdminGetAllTemplate,
  AdminDeleteTemplate,
  AdminUpdateTemplate,
  AdminGetAllTemplateField,
  AdminGetAllActiveTemplate,
} = require("../../Controller/Admin/AdminTemplate");
var router = express.Router();

router.get("/", AdminGetAllTemplate);
router.post("/", AdminAddTemplate);
router.delete("/", AdminDeleteTemplate);
router.put("/", AdminUpdateTemplate);

router.get("/field", AdminGetAllTemplateField);
router.get("/active", AdminGetAllActiveTemplate);

module.exports = router;
