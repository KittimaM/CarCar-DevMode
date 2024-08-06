const Conn = require("../../db");

const AdminGetAllTemplate = (req, res, next) => {
  Conn.execute("SELECT * FROM template", function (error, results) {
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

const AdminAddTemplate = (req, res, next) => {
  const { name, template, is_available } = req.body;
  Conn.execute(
    "INSERT INTO template (name, template, is_available) VALUES (?,?,?)",
    [name, template, is_available],
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

const AdminDeleteTemplate = (req, res, next) => {
  const { id } = req.body;
  Conn.execute(
    "DELETE FROM template WHERE id = ?",
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

const AdminUpdateTemplate = (req, res, next) => {
  const { id, name, template, is_available } = req.body;
  Conn.execute(
    "UPDATE template SET name = ?, template = ?, is_available = ? WHERE id = ?",
    [name, template, is_available, id],
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
  AdminGetAllTemplate,
  AdminAddTemplate,
  AdminDeleteTemplate,
  AdminUpdateTemplate,
};
