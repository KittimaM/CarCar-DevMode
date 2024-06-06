var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const Conn = require("../../db");
const secret = process.env.SECRET_WORD;

const AdminGetAllDayOff = (req, res, next) => {
  Conn.execute("SELECT * FROM day_off", function (error, results) {
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

const AdminUpdateDayOff = (req, res, next) => {
  const { staff_id, day_off } = req.body;
  Conn.execute(
    "UPDATE day_off SET day_off = ? WHERE staff_id = ?",
    [day_off, staff_id],
    function (error, result) {
      if (error) {
        res.json({ status: "ERROR", msg: error });
      } else {
        res.json({ status: "SUCCESS", msg: "SUCCESS" });
      }
    }
  );
};
module.exports = { AdminGetAllDayOff, AdminUpdateDayOff };
