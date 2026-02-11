const express = require("express");
const { lineAuthRedirect, lineCallback } = require("../../Controller/Customer/CustomerLineLogin");
const router = express.Router();

router.get("/auth", lineAuthRedirect);
router.get("/callback", lineCallback);

module.exports = router;
