var express = require("express");
const {
  AdminGetChannel,
  AdminAddChannel,
  AdminDeleteChannel,
  AdminUpdateChannel,
} = require("../../Controller/Admin/AdminChannel");
var router = express.Router();

router.get("/", AdminGetChannel);
router.post("/", AdminAddChannel);
router.delete("/", AdminDeleteChannel);
router.put("/", AdminUpdateChannel);

module.exports = router;
