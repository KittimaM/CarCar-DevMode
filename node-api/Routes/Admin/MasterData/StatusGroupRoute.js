var express = require("express");
const {
  GetAllStatusGroup,
  PostAddStatusGroup,
  DeleteStatusGroup,
  PutUpdateStatusGroup,
} = require("../../../Controller/Admin/MasterData/StatusGroupApi");
var router = express.Router();

router.get("/", GetAllStatusGroup);
router.post("/", PostAddStatusGroup);
router.delete("/", DeleteStatusGroup);
router.put("/", PutUpdateStatusGroup);

module.exports = router;
