var express = require("express");
const { getAllModules, getMoldulesByPermission } = require("../../../Controller/Admin/AdminRole/Modules");

var router = express.Router();

router.get("/", getAllModules);
router.get("/by-permission", getMoldulesByPermission)

module.exports = router;