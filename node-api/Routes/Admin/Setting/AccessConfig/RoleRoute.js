var express = require("express");
const {
  GetAllRole,
  PostAddRole,
  DeleteRole,
  PutUpdateRole,
} = require("../../../../Controller/Admin/Setting/AccessConfig/RoleApi");

var router = express.Router();

router.get("/", GetAllRole);
router.post("/", PostAddRole);
router.delete("/", DeleteRole);
router.put("/", PutUpdateRole);

module.exports = router;
