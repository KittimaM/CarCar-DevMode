var express = require("express");
const {
  GetAllStatus,
  PostAddStatus,
  DeleteStatus,
  PutUpdateStatus,
} = require("../../../Controller/Admin/MasterData/StatusApi");
var router = express.Router();

router.get("/", GetAllStatus);
router.post("/", PostAddStatus);
router.delete("/", DeleteStatus);
router.put("/", PutUpdateStatus);

module.exports = router;
