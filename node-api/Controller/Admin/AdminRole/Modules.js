const Conn = require("../../../db");
var jwt = require("jsonwebtoken");
const secret = process.env.SECRET_WORD;

const getAllModules = (req, res, next) => {
  Conn.execute(
    "SELECT module.id AS module_id, module.code AS module_code, module.name AS module_name, module.parent_id AS module_parent_id, permission.id AS permission_id, permission.code AS permission_code, permission.name AS permission_name FROM module JOIN module_permission ON module_permission.module_id = module.id JOIN permission ON permission.id = module_permission.permission_id ORDER BY module_id, permission_id;",
    function (error, results) {
      if (error) {
        return res.json({ status: "ERROR", msg: error });
      }
      if (results.length == 0) {
        return res.json({ status: "NO DATA", msg: "NO DATA" });
      } else {
        return res.json({ status: "SUCCESS", msg: results });
      }
    },
  );
};

const getMoldulesByPermission = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, secret);
    const { role_id } = decoded;
    Conn.execute(
      "SELECT module.id AS module_id, module.code, module.name, module.parent_id, permission.code AS permission_action FROM module JOIN role_permission ON role_permission.module_id = module.id JOIN permission ON permission.id = role_permission.permission_id WHERE role_permission.role_id = ?",
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
  getAllModules,
  getMoldulesByPermission,
};
