var express = require("express");
const {
  getRolePermissionByToken,
  getRolePermissionById,
} = require("../../../Controller/Admin/AdminRole/RolePermission");

var router = express.Router();

router.get("/token", getRolePermissionByToken);
router.post("/id", getRolePermissionById);

module.exports = router;
