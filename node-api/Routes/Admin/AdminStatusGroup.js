var express = require("express");
const {
  AdminGetAllStatusGroup,
  AdminAddStatusGroup,
  AdminDeleteStatusGroup,
  AdminUpdateStatusGroup,
} = require("../../Controller/Admin/AdminStatusGroup");
var router = express.Router();

router.get("/", AdminGetAllStatusGroup);
router.post("/", AdminAddStatusGroup);
router.delete("/", AdminDeleteStatusGroup);
router.put("/", AdminUpdateStatusGroup);

module.exports = router;
