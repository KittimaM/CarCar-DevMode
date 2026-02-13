var express = require("express");
const {
  AdminGetAllStatus,
  AdminAddStatus,
  AdminDeleteStatus,
  AdminUpdateStatus,
} = require("../../../Controller/Admin/MasterData/AdminStatus");
var router = express.Router();

router.get("/", AdminGetAllStatus);
router.post("/", AdminAddStatus);
router.delete("/", AdminDeleteStatus);
router.put("/", AdminUpdateStatus);

module.exports = router;
