var express = require("express");
const { GetAllChannelMatching } = require("../../../Controller/Admin/Management/ChannelMatchingApi");
var router = express.Router();

router.get("/", GetAllChannelMatching);


module.exports = router;
