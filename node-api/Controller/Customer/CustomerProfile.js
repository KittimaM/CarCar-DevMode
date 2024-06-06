var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const Conn = require("../../db");
const secret = process.env.SECRET_WORD;

const CustomerGetProfile = (req, res, next) => {
  try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, secret);
      const {id} = decoded;
  
      Conn.execute(
        `SELECT name, phone FROM customer WHERE id = ?`,
        [id],
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
    } catch (err) {
      res.json({ status: "ERROR", msg: "token expired" });
    }
};

const CustomerUpdateProfile = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, secret);
    const {id} = decoded;
    const {phone, name} = req.body;

    Conn.execute(
      `UPDATE customer SET phone = ?, name = ? WHERE id = ?`,
      [phone, name, id],
      function (error, result) {
        if (error) {
          res.json({ status: error.code, msg: error.sqlMessage });
        } else {
          res.json({ status: "SUCCESS", msg: "SUCCESS" });
        }
      }
    );
  } catch (err) {
    res.json({ status: "ERROR", msg: "token expired" });
  }
}

module.exports = {
  CustomerGetProfile,
  CustomerUpdateProfile
};
