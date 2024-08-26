var bcrypt = require("bcrypt");
const Conn = require("../../db");
const saltRounds = 10;

const CustomerRegister = (req, res, next) => {
  const { phone, name, password } = req.body;
  bcrypt.hash(password, saltRounds, function (error, hash) {
    if (error) {
      res.json({ status: "ERROR", msg: "in hash" });
    } else {
      Conn.execute(
        `INSERT INTO customer_user (phone, name , password) VALUES (?,?,?)`,
        [phone, name, hash],
        function (error, result) {
          if (error) {
            if (error.code == "ER_DUP_ENTRY") {
              res.json({
                status: error.code,
                msg: "This Phone Number Already In System",
              });
            } else {
              res.json({ status: "ERROR", msg: error });
            }
          } else {
            const insertId = result.insertId;
            res.json({ status: "SUCCESS", msg: insertId });
          }
        }
      );
    }
  });
};

module.exports = {
  CustomerRegister,
};
