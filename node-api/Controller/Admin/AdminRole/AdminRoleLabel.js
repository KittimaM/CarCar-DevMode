const Conn = require("../../../db");

const AdminGetAllRoleLabel = (req, res, next) => {
  Conn.execute("SELECT * FROM admin_role_label", function (error, results) {
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
