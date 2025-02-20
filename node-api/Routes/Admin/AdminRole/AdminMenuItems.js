var express = require("express");
const {
    AdminMenuItems,
} = require("../../../Controller/Admin/AdminRole/AdminMenuItems");
var router = express.Router();

router.get("/", AdminMenuItems);

module.exports = router;