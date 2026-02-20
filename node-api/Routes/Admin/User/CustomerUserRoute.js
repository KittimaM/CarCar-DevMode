var express = require("express");
const {
  GetAlllCustomerUser,
  PostAddCustomerUser,
  PutUpdateCustomerUser,
  DeleteCustomerUser,
  PutUnlockCustomerUser,
  GetCustomerUserById,
} = require("../../../Controller/Admin/User/CustomerUserApi");
var router = express.Router();

router.get("/", GetAlllCustomerUser);
router.post("/", PostAddCustomerUser);
router.put("/", PutUpdateCustomerUser);
router.delete("/", DeleteCustomerUser);
router.put("/unlock-user", PutUnlockCustomerUser);
router.post("/id", GetCustomerUserById);

module.exports = router;
