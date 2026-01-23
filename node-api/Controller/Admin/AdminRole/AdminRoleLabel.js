const Conn = require("../../../db");

const AdminGetAllRoleLabel = (req, res, next) => {
  Conn.execute("SELECT module.id AS module_id, module.code AS module_code, module.name AS module_name, module.parent_id AS module_parent_id, permission.id AS permission_id, permission.code AS permission_code, permission.name AS permission_name FROM module JOIN module_permission ON module_permission.module_id = module.id JOIN permission ON permission.id = module_permission.permission_id ORDER BY module_id, permission_id;", function (error, results) {
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

module.exports = {
  AdminGetAllRoleLabel,
};
