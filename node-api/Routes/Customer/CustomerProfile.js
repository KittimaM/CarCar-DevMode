var express = require("express");
const { CustomerGetProfile, CustomerUpdateProfile } = require("../../Controller/Customer/CustomerProfile");
var router = express.Router();

router.get("/", CustomerGetProfile);
router.put("/", CustomerUpdateProfile);

module.exports = router;