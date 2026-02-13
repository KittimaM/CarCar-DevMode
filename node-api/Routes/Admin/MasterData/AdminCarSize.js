var express = require("express");
const {
  AdminCarSize,
  AdminAddCarSize,
  AdminDeleteCarSize,
  AdminUpdateCarSize,
  UpdateCarSizeAvailable,
  GetCarSizeById,
  GetAvailableCarSize,
} = require("../../../Controller/Admin/MasterData/AdminCarSize");
var router = express.Router();

router.get("/", AdminCarSize);
router.post("/", AdminAddCarSize);
router.delete("/", AdminDeleteCarSize);
router.put("/", AdminUpdateCarSize);
router.put("/is-available", UpdateCarSizeAvailable);
router.post("/id", GetCarSizeById);
router.get("/is-available", GetAvailableCarSize)

module.exports = router;
