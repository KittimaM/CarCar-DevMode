var express = require("express");
const {
  AdminCarSize,
  AdminAddCarSize,
  AdminDeleteCarSize,
  AdminUpdateCarSize,
} = require("../../Controller/Admin/AdminCarSize");
var router = express.Router();

router.get("/", AdminCarSize);
router.post("/", AdminAddCarSize);
router.delete("/", AdminDeleteCarSize);
router.put("/", AdminUpdateCarSize);

module.exports = router;
