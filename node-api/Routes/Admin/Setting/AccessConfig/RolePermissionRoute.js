var express = require("express");
const {
  GetRolePermissionByToken,
  PostGetRolePermissionById,
} = require("../../../../Controller/Admin/Setting/AccessConfig/RolePermissionApi");

var router = express.Router();

router.get("/token", GetRolePermissionByToken);
router.post("/id", PostGetRolePermissionById);

module.exports = router;
