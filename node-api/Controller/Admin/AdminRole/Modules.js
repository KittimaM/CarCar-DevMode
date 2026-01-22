const Conn = require("../../../db");
var jwt = require("jsonwebtoken");
const secret = process.env.SECRET_WORD;

const getAllModules = (req, res, next) => {
  Conn.execute("SELECT * FROM module", function (error, results) {
    if (error) {
      res.json({ status: "ERROR", msg: error });
    }
    if (results.length == 0) {
      res.json({ status: "NO DATA", msg: "NO DATA" });
    } else {
      res.json({ status: "SUCCESS", msg: results });
    }
  });
};

const getMoldulesByPermission = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, secret);
    const { role_id } = decoded;
    Conn.execute(
      "SELECT module.id AS module_id, module.code, module.name, module.parent_id, permission.code AS permission_action FROM module JOIN role_permission ON role_permission.module_id = module.id JOIN permission ON permission.id = role_permission.permission_id WHERE role_permission.role_id = ? AND role_permission.is_allowed = 1",
      [role_id],
      function (error, result) {
        if (error) {
          res.json({ status: "ERROR", msg: error });
        } else if (result[0].length == 0) {
          res.json({ status: "NO DATA", msg: "NO DATA" });
        } else {
          res.json({ status: "SUCCESS", msg: result });
        }
      }
    );
  } catch (err) {
    res.json({ status: "ERROR", msg: "token expired" });
  }
};

module.exports = {
  getAllModules,
  getMoldulesByPermission
};
