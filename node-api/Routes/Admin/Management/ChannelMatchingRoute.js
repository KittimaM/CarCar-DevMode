var express = require("express");
const {
  GetAllChannelMatching,
  PostAddChannelMatching,
} = require("../../../Controller/Admin/Management/ChannelMatchingApi");
var router = express.Router();

router.get("/", GetAllChannelMatching);
router.post("/", PostAddChannelMatching);

module.exports = router;
