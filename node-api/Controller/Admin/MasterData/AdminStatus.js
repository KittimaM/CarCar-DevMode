const Conn = require("../../../db");

const AdminGetAllStatus = (req, res, next) => {
  Conn.execute(
    "SELECT status.id AS status_id, status.code AS status_code, status_group.id AS status_group_id, status_group.code AS status_group_code FROM status_group LEFT JOIN status ON status.status_group_id = status_group.id",
    function (error, results) {
      if (error) {
        return res.json({ status: "ERROR", msg: error });
      }
      if (results.length === 0) {
        return res.json({ status: "NO DATA", msg: "NO DATA" });
      } else {
        return res.json({ status: "SUCCESS", msg: results });
      }
    },
  );
};

const AdminAddStatus = (req, res, next) => {
  const { code, status_group_id } = req.body;
  Conn.execute(
    "INSERT INTO status (code, status_group_id) VALUES (?, ?)",
    [code, status_group_id],
    function (error) {
      if (error) {
        if (error.code === "ER_DUP_ENTRY") {
          return res.json({ status: "WARNING", msg: "Already In System" });
        } else {
          return res.json({ status: "ERROR", msg: error });
        }
      } else {
        return res.json({ status: "SUCCESS", msg: "Successfully Added" });
      }
    },
  );
};

const AdminDeleteStatus = (req, res, next) => {
  const { id } = req.body;
  Conn.execute("DELETE FROM status WHERE id = ?", [id], function (error) {
    if (error) {
      if (error.code === "ER_ROW_IS_REFERENCED_2") {
        return res.json({ status: "WARNING", msg: "Currently In Use" });
      } else {
        return res.json({ status: "ERROR", msg: error });
      }
    } else {
      return res.json({ status: "SUCCESS", msg: "Successfully Deleted" });
    }
  });
};

const AdminUpdateStatus = (req, res, next) => {
  const { id, code, status_group_id } = req.body;
  Conn.execute(
    "UPDATE status SET code = ?, status_group_id = ? WHERE id = ?",
    [code, status_group_id, id],
    function (error) {
      if (error) {
        if (error.code === "ER_DUP_ENTRY") {
          return res.json({ status: "WARNING", msg: "Already In System" });
        } else {
          return res.json({ status: "ERROR", msg: error });
        }
      } else {
        return res.json({ status: "SUCCESS", msg: "Successfully Updated" });
      }
    },
  );
};

module.exports = {
  AdminGetAllStatus,
  AdminAddStatus,
  AdminDeleteStatus,
  AdminUpdateStatus,
};
