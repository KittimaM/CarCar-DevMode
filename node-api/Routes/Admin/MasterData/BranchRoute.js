var express = require("express");
const {
  PostAddBranch,
  GetAllBranch,
  DeleteBranch,
  PutUpdateBranch,
} = require("../../../Controller/Admin/MasterData/BranchApi");
var router = express.Router();

router.get("/", GetAllBranch);
router.post("/", PostAddBranch);
router.delete("/", DeleteBranch);
router.put("/", PutUpdateBranch);

module.exports = router;
