var express = require("express");
const { CustomerIndex } = require("../../Controller/Customer/CustomerIndex");
var router = express.Router();

router.get("/", CustomerIndex);

module.exports = router;