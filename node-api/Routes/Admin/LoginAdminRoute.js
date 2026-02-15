var express = require("express");
const { PostLoginAdmin } = require("../../Controller/Admin/LoginAdminApi");
var router = express.Router();

router.post("/", PostLoginAdmin);

module.exports = router;