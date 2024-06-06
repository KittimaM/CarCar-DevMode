const Conn = require("../../db");

const AdminGetAllStatusGroup = (req, res, next) => {
  Conn.execute("SELECT * FROM status_group", function (error, results) {
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

const AdminAddStatusGroup = (req, res, next) => {
  const { code, description } = req.body;
  Conn.execute(
    "INSERT INTO status_group (code, description) VALUES (?,?)",
    [code, description],
    function (error, result) {
      if (error) {
        res.json({ status: "ERROR", msg: error });
      } else {
        const insertId = result.insertId;
        res.json({ status: "SUCCESS", msg: insertId });
      }
    }
  );
};

const AdminDeleteStatusGroup = (req, res, next) => {
  const { id } = req.body;
  Conn.execute(
    "DELETE FROM status_group WHERE id = ?",
    [id],
    function (error, result) {
      if (error) {
        res.json({ status: "ERROR", msg: error });
      } else {
        res.json({ status: "SUCCESS", msg: "SUCCESS" });
      }
    }
  );
};

const AdminUpdateStatusGroup = (req, res, next) => {
  const { id, code, description } = req.body;
  Conn.execute(
    "UPDATE status_group SET code = ?, description = ? WHERE id = ?",
    [code, description, id],
    function (error, result) {
      if (error) {
        res.json({ status: "ERROR", msg: error });
      } else {
        res.json({ status: "SUCCESS", msg: "SUCCESS" });
      }
    }
  );
};
module.exports = {
  AdminGetAllStatusGroup,
  AdminAddStatusGroup,
  AdminDeleteStatusGroup,
  AdminUpdateStatusGroup,
};
