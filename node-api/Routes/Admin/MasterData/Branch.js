var express = require("express");
const {
  AddBranch,
  GetAllBranch,
  DeleteBranch,
  UpdateBranch,
} = require("../../../Controller/Admin/MasterData/Branch");
var router = express.Router();

router.get("/", GetAllBranch);
router.post("/", AddBranch);
router.delete("/", DeleteBranch);
router.put("/", UpdateBranch);

module.exports = router;
