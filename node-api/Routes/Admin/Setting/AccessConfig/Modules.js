var express = require("express");
const {
  getAllModules,
  getMoldulesByPermission,
} = require("../../../../Controller/Admin/Setting/AccessConfig/Modules");

var router = express.Router();

router.get("/", getAllModules);
router.get("/by-permission", getMoldulesByPermission);

module.exports = router;
