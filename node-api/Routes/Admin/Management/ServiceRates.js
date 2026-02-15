var express = require("express");
const {
  GetAllServiceRates,
  PostAddServiceRates,
  PostDeleteServiceRates,
  PutUpdateServiceRates,
} = require("../../../Controller/Admin/Management/ServiceRates");
var router = express.Router();

router.get("/", GetAllServiceRates);
router.post("/", PostAddServiceRates);
router.delete("/", PostDeleteServiceRates);
router.put("/", PutUpdateServiceRates);

module.exports = router;
