const Conn = require("../../../db");

const AdminGetAllRole = (req, res, next) => {
  Conn.execute("SELECT * FROM role", function (error, results) {
    if (error) {
      return res.json({ status: "ERROR", msg: error });
    }
    if (results.length === 0) {
      return res.json({ status: "NO DATA", msg: "NO DATA" });
    } else {
      return res.json({ status: "SUCCESS", msg: results });
    }
  });
};

const AdminAddRole = (req, res, next) => {
  const { role_name, allowedAccess } = req.body;

  Conn.execute(
    `INSERT INTO role (name) VALUES (?)`,
    [role_name],
    function (error, result) {
      if (error) {
        return res.json({ status: "ERROR", msg: error });
      }

      const role_id = result.insertId;
      const values = allowedAccess.map((item) => [
        role_id,
        item.module_id,
        item.permission_id,
      ]);

      Conn.query(
        `INSERT INTO role_permission (role_id, module_id, permission_id)
         VALUES ?`,
        [values],
        function (error) {
          if (error) {
            return res.json({ status: "ERROR", msg: error });
          }

          return res.json({
            status: "SUCCESS",
            msg: "SUCCESS",
          });
        }
      );
    }
  );
};

const AdminDeleteRole = (req, res, next) => {
  const { id } = req.body;
  Conn.execute(
    "SELECT role_id FROM staff_user WHERE role_id = ? ",
    [id],
    function (error, users) {
      if (error) {
        return res.json({ status: "ERROR", msg: error });
      }
      if (users.length !== 0) {
        return res.json({ status: "ERROR", msg: "IN USE" });
      } else {
        Conn.execute(
          "DELETE FROM role_permission WHERE role_id = ?",
          [id],
          function (error) {
            if (error) {
              return res.json({ status: "ERROR", msg: error });
            } else {
              Conn.execute(
                "DELETE FROM role WHERE id = ? ",
                [id],
                function (error) {
                  if (error) {
                    return res.json({ status: "ERROR", msg: error });
                  } else {
                    return res.json({ status: "SUCCESS", msg: "SUCCESS" });
                  }
                }
              );
            }
          }
        );
      }
    }
  );
};

const AdminUpdateRole = (req, res, next) => {
  const { role_id, role_name, allowedAccess } = req.body;

  Conn.execute(
    "UPDATE role SET name = ?, updated_at = CURRENT_TIMESTAMP() WHERE id = ?",
    [role_name, role_id],
    function (error) {
      if (error) {
        return res.json({ status: "ERROR", msg: error });
      }
      Conn.execute(
        "DELETE FROM role_permission WHERE role_id = ?",
        [role_id],
        function (error) {
          if (error) {
            return res.json({ status: "ERROR", msg: error });
          }
          const values = allowedAccess.map((item) => [
            role_id,
            item.module_id,
            item.permission_id,
          ]);

          Conn.query(
            `INSERT INTO role_permission (role_id, module_id, permission_id)
         VALUES ?`,
            [values],
            (error) => {
              if (error) {
                return res.json({ status: "ERROR", msg: error });
              } else {
                return res.json({
                  status: "SUCCESS",
                  msg: "SUCCESS",
                });
              }
            }
          );
        }
      );
    }
  );
};

module.exports = {
  AdminGetAllRole,
  AdminAddRole,
  AdminDeleteRole,
  AdminUpdateRole,
};
