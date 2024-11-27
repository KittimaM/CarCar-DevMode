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
  const { name, template, is_available, is_have_custom_field, custom_field } =
    req.body;
  Conn.execute(
    "INSERT INTO template (name, template, is_available, is_have_custom_field, custom_field) VALUES (?,?,?,?,?)",
    [name, template, is_available, is_have_custom_field, custom_field],
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
  const {
    id,
    name,
    template,
    is_available,
    is_have_custom_field,
    custom_field,
  } = req.body;
  Conn.execute(
    "UPDATE template SET name = ?, template = ?, is_available = ?, is_have_custom_field = ?, custom_field = ? WHERE id = ?",
    [name, template, is_available, is_have_custom_field, custom_field, id],
    function (error, result) {
      if (error) {
        res.json({ status: "ERROR", msg: error });
      } else {
        res.json({ status: "SUCCESS", msg: "SUCCESS" });
      }
    }
  );
};

const AdminGetAllTemplateField = (req, res, next) => {
  Conn.execute("SELECT * FROM template_field", function (error, results) {
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

const AdminGetAllActiveTemplate = (req, res, next) => {
  Conn.execute(
    "SELECT * FROM template WHERE is_available = 1",
    function (error, results) {
      if (error) {
        res.json({ status: "ERROR", msg: error });
      }
      if (results.length == 0) {
        res.json({ status: "NO DATA", msg: "NO DATA" });
      } else {
        res.json({ status: "SUCCESS", msg: results });
      }
    }
  );
};

module.exports = {
  AdminGetAllActiveTemplate,
  AdminGetAllTemplateField,
  AdminGetAllTemplate,
  AdminAddTemplate,
  AdminDeleteTemplate,
  AdminUpdateTemplate,
};
