var express = require("express");
const { AdminPermission } = require("../../Controller/Admin/AdminPermission");
var router = express.Router();

router.get("/", AdminPermission);

module.exports = router;
