var express = require("express");
const { CustomerLogin } = require("../../Controller/Customer/CustomerLogin");
var router = express.Router();

router.post("/", CustomerLogin);

module.exports = router;