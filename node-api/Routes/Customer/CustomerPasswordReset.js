var express = require("express");
const { ForgotPassword, ResetPassword } = require("../../Controller/Customer/CustomerPasswordReset");
var router = express.Router();

router.post("/forgot", ForgotPassword);
router.post("/reset", ResetPassword);

module.exports = router;
