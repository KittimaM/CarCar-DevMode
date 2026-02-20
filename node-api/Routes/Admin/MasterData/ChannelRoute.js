var express = require("express");
const {
  GetAllChannel,
  PostAddChannel,
  DeleteChannel,
  PutUpdateChannel,
} = require("../../../Controller/Admin/MasterData/ChannelApi");
var router = express.Router();

router.get("/", GetAllChannel);
router.post("/", PostAddChannel);
router.delete("/", DeleteChannel);
router.put("/", PutUpdateChannel);

module.exports = router;
