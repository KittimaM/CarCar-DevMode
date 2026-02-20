var express = require("express");
const { GetAllStaffUser, PostAddStaffUser, DeleteStaffUser, PutUpdateStaffUser, PutUnlockStaffUser, GetStaffUserById } = require("../../../Controller/Admin/User/StaffUserApi");
var router = express.Router();

router.get("/", GetAllStaffUser);
router.post("/", PostAddStaffUser);
router.delete("/", DeleteStaffUser);
router.put("/", PutUpdateStaffUser);
router.put("/unlock-user", PutUnlockStaffUser);
router.post("/id", GetStaffUserById);

module.exports = router;
