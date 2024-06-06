var express = require("express");
const { CustomerRegister } = require("../../Controller/Customer/CustomerRegister");
var router = express.Router();

router.post("/", CustomerRegister);

module.exports = router;