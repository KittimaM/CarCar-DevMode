var express = require("express");
const {
  GetAllModules,
  GetMoldulesByPermission,
} = require("../../../../Controller/Admin/Setting/AccessConfig/ModulesApi");

var router = express.Router();

router.get("/", GetAllModules);
router.get("/by-permission", GetMoldulesByPermission);

module.exports = router;
