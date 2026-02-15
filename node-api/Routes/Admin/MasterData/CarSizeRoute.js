var express = require("express");
const {
  GetAllCarSize,
  PostAddCarSize,
  DeleteCarSize,
  PutUpdateCarSize,
  GetCarSizeById,
} = require("../../../Controller/Admin/MasterData/CarSizeApi");
var router = express.Router();

router.get("/", GetAllCarSize);
router.post("/", PostAddCarSize);
router.delete("/", DeleteCarSize);
router.put("/", PutUpdateCarSize);
router.post("/id", GetCarSizeById);

module.exports = router;
