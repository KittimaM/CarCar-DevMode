var express = require("express");
const { testPathGet } = require("../Controller/testPath");
var router = express.Router();

router.post("/", testPathGet);

module.exports = router;
