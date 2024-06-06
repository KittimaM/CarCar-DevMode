var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const Conn = require("../../db");
const secret = process.env.SECRET_WORD;

const AdminGetAllRole = (req, res, next) => {
  Conn.execute("SELECT * FROM role", function (error, results) {
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

const AdminAddRole = (req, res, next) => {
  const columns = Object.keys(req.body);
  const values = Object.values(req.body);
  Conn.execute(
    `INSERT INTO role(${columns.map((item) => `${item}`).join(",")})
    VALUES (${values.map((item) => `'${item}'`).join(",")})`,
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

const AdminDeleteRole = (req, res, next) => {
  const { id } = req.body;
  Conn.execute("DELETE FROM role WHERE id = ?", [id], function (error, result) {
    if (error) {
      res.json({ status: "ERROR", msg: error });
    } else {
      res.json({ status: "SUCCESS", msg: "SUCCESS" });
    }
  });
};

const AdminUpdateRole = (req, res, next) => {
  const { id } = req.body;
  const columns = Object.keys(req.body);
  const values = Object.values(req.body);

  Conn.execute(
    `UPDATE role SET ${columns
      .map((item) => `${item} = ?`)
      .join(", ")}  WHERE id = ?`,
    [...values, id],
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
  AdminGetAllRole,
  AdminAddRole,
  AdminDeleteRole,
  AdminUpdateRole,
};
