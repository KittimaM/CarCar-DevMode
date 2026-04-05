var express = require("express");
const {
  GetAllChannelSchedule,
  GetAllChannel,
  PostAddChannel,
  DeleteChannel,
  PutUpdateChannel,
} = require("../../../Controller/Admin/MasterData/ChannelApi");
var router = express.Router();

router.get("/schedule", GetAllChannelSchedule);
router.get("/", GetAllChannel);
router.post("/", PostAddChannel);
router.delete("/", DeleteChannel);
router.put("/", PutUpdateChannel);

module.exports = router;
