var express = require("express");
const { AdminGetAllProvince } = require("../../Controller/Admin/AdminProvince");
var router = express.Router();

router.get("/", AdminGetAllProvince);

module.exports = router;
