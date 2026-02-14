var express = require("express");
const { AddBranch, GetAllBranch, DeleteBranch, UpdateBranchAvailable, UpdateBranch, GetAvailableBranch } = require("../../../Controller/Admin/MasterData/Branch");
var router = express.Router();

router.get("/", GetAllBranch);
router.post("/", AddBranch);
router.delete("/", DeleteBranch);
router.put("/is-available", UpdateBranchAvailable);
router.put("/", UpdateBranch); 
router.get("/is-available", GetAvailableBranch);

module.exports = router;
