var express = require("express");
const { AdminLogin } = require("../../Controller/Admin/AdminLogin");
var router = express.Router();

router.post("/", AdminLogin);

module.exports = router;