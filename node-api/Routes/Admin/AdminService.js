var express = require("express");
const {
  AdminService,
  AdminAddService,
  AdminDeleteService,
  AdminUpdateService,
  UpdateServiceAvailable,
  GetAvailableService,
} = require("../../Controller/Admin/AdminService");
var router = express.Router();

router.get("/", AdminService);
router.post("/", AdminAddService);
router.delete("/", AdminDeleteService);
router.put("/", AdminUpdateService);
router.put("/is-available", UpdateServiceAvailable);
router.get("/is-available", GetAvailableService);

module.exports = router;
