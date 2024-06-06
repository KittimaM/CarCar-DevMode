var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const Conn = require("../../db");
const secret = process.env.SECRET_WORD;

const AdminGetChannel = (req, res, next) => {
  Conn.execute(`SELECT * FROM channel`, function (error, results) {
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

const AdminAddChannel = (req, res, next) => {
  const { name, description, is_available, service } = req.body;
  Conn.execute(
    "INSERT INTO channel (name, description, is_available, service) VALUES (?,?,?,?)",
    [name, description, is_available, service],
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

const AdminDeleteChannel = (req, res, next) => {
  const { id } = req.body;
  Conn.execute(
    "DELETE FROM channel WHERE id = ?",
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

const AdminUpdateChannel = (req, res, next) => {
  const { id, name, description, is_available, service } = req.body;
  Conn.execute(
    "UPDATE channel SET name = ?, description = ?, is_available = ?, service = ? WHERE id = ?",
    [name, description, is_available, service, id],
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
  AdminGetChannel,
  AdminAddChannel,
  AdminDeleteChannel,
  AdminUpdateChannel,
};
