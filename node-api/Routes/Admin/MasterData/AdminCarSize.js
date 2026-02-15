var express = require("express");
const {
  AdminCarSize,
  AdminAddCarSize,
  AdminDeleteCarSize,
  AdminUpdateCarSize,
  GetCarSizeById,
} = require("../../../Controller/Admin/MasterData/AdminCarSize");
var router = express.Router();

router.get("/", AdminCarSize);
router.post("/", AdminAddCarSize);
router.delete("/", AdminDeleteCarSize);
router.put("/", AdminUpdateCarSize);
router.post("/id", GetCarSizeById);

module.exports = router;
