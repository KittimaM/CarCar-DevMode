var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const Conn = require("../../db");
const secret = process.env.SECRET_WORD;

const AdminGetAdvanceSetting = (req, res, next) => {
  Conn.execute("SELECT * FROM general_setting", function (error, results) {
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

const AdminUpdateAdvanceSetting = (req, res, next) => {
  const {
    staff_failed_login_limit,
    staff_user_login_mins_limit,
    staff_inactive_limit,
    customer_failed_login_limit,
    customer_user_login_mins_limit,
    customer_inactive_limit,
  } = req.body;
  Conn.execute(
    `UPDATE general_setting SET 
    staff_failed_login_limit = ?,
    staff_user_login_mins_limit = ?,
    staff_inactive_limit = ?,
    customer_failed_login_limit = ?,
    customer_user_login_mins_limit = ?,
    customer_inactive_limit = ?`,
    [
      staff_failed_login_limit,
      staff_user_login_mins_limit,
      staff_inactive_limit,
      customer_failed_login_limit,
      customer_user_login_mins_limit,
      customer_inactive_limit,
    ],
    function (error, result) {
      staff_failed_login_limit;
      if (error) {
        res.json({ status: "ERROR", msg: error });
      } else {
        res.json({ status: "SUCCESS", msg: "SUCCESS" });
      }
    }
  );
};

module.exports = { AdminGetAdvanceSetting, AdminUpdateAdvanceSetting };
