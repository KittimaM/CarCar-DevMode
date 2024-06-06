var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const Conn = require("../../db");
const secret = process.env.SECRET_WORD;

const AdminLogin = (req, res, next) => {
  const userName = req.body.username;
  const passWord = req.body.password;
  Conn.execute(
    `SELECT * FROM staff_user WHERE username = ? LIMIT 1`,
    [userName],
    function (error, result) {
      if (error) {
        res.json({ status: "ERROR", msg: error });
      } else if (result.length == 0) {
        res.json({ status: "ERROR ", msg: "NO DATA" });
      } else {
        const { id, username, password, role_id, role } = result[0];
        bcrypt.compare(passWord, password, function (error, result) {
          if (error) {
            res.json({ status: "ERROR", msg: error });
          } else {
            if (result) {
              const token = jwt.sign(
                { id: id, username: username, role_id: role_id, role: role },
                secret,
                { expiresIn: "10h" }
              );
              res.json({ status: "SUCCESS", msg: token });
            } else {
              res.json({ status: "ERROR", msg: "Wrong Password" });
            }
          }
        });
      }
    }
  );
};

module.exports = {
  AdminLogin,
};
