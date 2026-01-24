var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const Conn = require("../../db");
const secret = process.env.SECRET_WORD;

const AdminPermission = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, secret);
    const { role_id } = decoded;
    Conn.execute(
      "SELECT permission.* FROM permission JOIN role ON role.id = permission.role_id WHERE role.id = ?",
      [role_id],
      function (error, result) {
        if (error) {
          return res.json({ status: "ERROR", msg: error });
        } else if (result[0].length == 0) {
          return res.json({ status: "NO DATA", msg: "NO DATA" });
        } else {
          return res.json({ status: "SUCCESS", msg: result });
        }
      },
    );
  } catch (err) {
    return res.json({ status: "ERROR", msg: "token expired" });
  }
};

module.exports = {
  AdminPermission,
};

// old permission = use less data
// new permission = more readable
