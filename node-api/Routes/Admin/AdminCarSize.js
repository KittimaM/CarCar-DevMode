var express = require("express");
const {
  AdminCarSize,
  AdminAddCarSize,
  AdminDeleteCarSize,
  AdminUpdateCarSize,
  UpdateCarSizeAvailable,
  GetCarSizeById,
} = require("../../Controller/Admin/AdminCarSize");
var router = express.Router();

router.get("/", AdminCarSize);
router.post("/", AdminAddCarSize);
router.delete("/", AdminDeleteCarSize);
router.put("/", AdminUpdateCarSize);
router.put("/is-available", UpdateCarSizeAvailable);
router.post("/id", GetCarSizeById);

module.exports = router;
