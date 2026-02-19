var express = require("express");
const {
  GetAllChannelMatching,
  PostAddChannelMatching,
  DeleteChannelMatching,
  PutUpdateChannelMatching,
  PutUpdateChannelMatchingAvailable,
} = require("../../../Controller/Admin/Management/ChannelMatchingApi");
var router = express.Router();

router.get("/", GetAllChannelMatching);
router.post("/", PostAddChannelMatching);
router.delete("/", DeleteChannelMatching);
router.put("/available", PutUpdateChannelMatchingAvailable);
router.put("/", PutUpdateChannelMatching);

module.exports = router;
