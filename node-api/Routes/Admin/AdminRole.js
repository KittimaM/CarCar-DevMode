var express = require("express");
const {
  AdminGetAllRole,
  AdminAddRole,
  AdminDeleteRole,
  AdminUpdateRole,
} = require("../../Controller/Admin/AdminRole");

var router = express.Router();

router.get("/", AdminGetAllRole);
router.post("/", AdminAddRole);
router.delete("/", AdminDeleteRole);
router.put("/", AdminUpdateRole);

module.exports = router;
