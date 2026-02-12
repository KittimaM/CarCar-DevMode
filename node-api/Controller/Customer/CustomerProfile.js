var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const Conn = require("../../db");
const secret = process.env.SECRET_WORD;

const CustomerGetProfile = (req, res,) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, secret);
    const { id } = decoded;

    Conn.execute(
      `SELECT name, phone FROM customer_user WHERE id = ?`,
      [id],
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
  } catch (err) {
    return res.json({ status: "ERROR", msg: "token expired" });
  }
};

const CustomerUpdateProfile = (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, secret);
    const { id } = decoded;
    const { phone, name } = req.body;

    Conn.execute(
      "SELECT line_id FROM customer_user WHERE id = ?",
      [id],
      function (err, rows) {
        if (err) return res.json({ status: "ERROR", msg: err.message });
        const hasLineId = rows && rows.length > 0 && rows[0].line_id != null;
        const phoneVal = phone === "" || phone == null ? null : phone;
        const sql = hasLineId
          ? "UPDATE customer_user SET name = ? WHERE id = ?"
          : "UPDATE customer_user SET phone = ?, name = ? WHERE id = ?";
        const params = hasLineId ? [name, id] : [phoneVal, name, id];
        Conn.execute(sql, params, function (error, result) {
          if (error) {
            return res.json({ status: error.code, msg: error.sqlMessage });
          }
          return res.json({ status: "SUCCESS", msg: "SUCCESS" });
        });
      }
    );
  } catch (err) {
    return res.json({ status: "ERROR", msg: "token expired" });
  }
};

module.exports = {
  CustomerGetProfile,
  CustomerUpdateProfile,
};
