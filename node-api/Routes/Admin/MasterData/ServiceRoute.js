var express = require("express");
const {
  GetAllService,
  PostAddService,
  DeleteService,
  PutUpdateService,
} = require("../../../Controller/Admin/MasterData/ServiceApi");
var router = express.Router();

router.get("/", GetAllService);
router.post("/", PostAddService);
router.delete("/", DeleteService);
router.put("/", PutUpdateService);

module.exports = router;
