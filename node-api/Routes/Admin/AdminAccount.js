var express = require("express");
const {
  AdminGetAllAccount,
  AdminAddAccount,
  AdminDeleteAccount,
  AdminUpdateAccount,
} = require("../../Controller/Admin/AdminAccount");
var router = express.Router();

router.get("/", AdminGetAllAccount);
router.post("/", AdminAddAccount);
router.delete("/", AdminDeleteAccount);
router.put("/", AdminUpdateAccount);

module.exports = router;
