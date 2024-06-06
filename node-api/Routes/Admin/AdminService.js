var express = require("express");
const {
  AdminService,
  AdminAddService,
  AdminDeleteService,
  AdminUpdateService,
} = require("../../Controller/Admin/AdminService");
var router = express.Router();

router.get("/", AdminService);
router.post("/", AdminAddService);
router.delete("/", AdminDeleteService);
router.put("/", AdminUpdateService);

module.exports = router;
