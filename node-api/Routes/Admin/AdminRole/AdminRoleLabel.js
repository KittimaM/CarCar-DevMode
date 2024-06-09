var express = require("express");
const {
  AdminGetAllRoleLabel,
} = require("../../../Controller/Admin/AdminRole/AdminRoleLabel");
var router = express.Router();

router.get("/", AdminGetAllRoleLabel);

module.exports = router;
