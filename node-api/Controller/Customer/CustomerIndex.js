var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const Conn = require("../../db");
const secret = process.env.SECRET_WORD;

const CustomerIndex = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const { phone } = jwt.verify(token, secret);
    Conn.execute(
      "SELECT * FROM booking WHERE customer_phone = ?",
      [phone],
      function (error, result) {
        if (error) {
          res.json({ status: "ERROR", msg: error });
        } else if (result.length == 0) {
          res.json({ status: "NO DATA" , msg: "NO DATA"});
        } else {
          res.json({ status: "SUCCESS", msg: result });
        }
      }
    );
  } catch (error) {
    res.json({ status: "ERROR", msg: "token expired" });
  }
};

module.exports = {
  CustomerIndex,
};
