var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const Conn = require("../../db");
const secret = process.env.SECRET_WORD;

const AdminGetAllOnLeaveType = (req, res, next) => {
  Conn.execute("SELECT * FROM on_leave_type", function (error, results) {
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

const AdminDeleteOnLeaveType = (req, res, next) => {
  const { id } = req.body;
  Conn.execute(
    "DELETE FROM on_leave_type WHERE id = ? ",
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

const AdminUpdateOnLeaveType = (req, res, next) => {
  const { id, type, day_limit, is_available } = req.body;
  Conn.execute(
    "UPDATE on_leave_type SET type = ?, day_limit = ?, is_available = ? WHERE id = ?",
    [type, day_limit, is_available, id],
    function (error, result) {
      if (error) {
        res.json({ status: "ERROR", msg: error });
      } else {
        res.json({ status: "SUCCESS", msg: "SUCCESS" });
      }
    }
  );
};

const AdminAddOnLeaveType = (req, res, next) => {
  const { type, day_limit, is_available } = req.body;
  Conn.execute(
    "INSERT INTO on_leave_type (type, day_limit, is_available) VALUES (?, ?, ?)",
    [type, day_limit, is_available],
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

module.exports = {
  AdminGetAllOnLeaveType,
  AdminDeleteOnLeaveType,
  AdminUpdateOnLeaveType,
  AdminAddOnLeaveType,
};
