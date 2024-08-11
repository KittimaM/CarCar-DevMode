var express = require("express");
const {
  AdminGetAllSearchFilters,
  AdminGetSearchResult,
} = require("../../Controller/Admin/AdminSearch");
var router = express.Router();

router.get("/", AdminGetAllSearchFilters);
router.post("/", AdminGetSearchResult);
module.exports = router;
