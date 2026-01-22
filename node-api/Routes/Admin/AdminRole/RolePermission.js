var express = require("express");
const { getRolePermissionById, getAll } = require("../../../Controller/Admin/AdminRole/RolePermission");

var router = express.Router();

router.get("/id", getRolePermissionById);

module.exports = router;