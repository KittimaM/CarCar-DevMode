var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const Conn = require("../../db");
const secret = process.env.SECRET_WORD;

const CustomerLogin = (req, res, next) => {
  const {
    phone,
    password,
    customer_failed_login_limit,
    customer_user_login_mins_limit,
  } = req.body;
  Conn.execute(
    "SELECT * FROM customer_user WHERE phone = ?",
    [phone],
    function (error, result) {
      if (error) {
        return res.json({ status: "ERROR", error });
      }
      if (result.length == 0) {
        return res.json({ status: "ERROR", msg: "Wrong username or password" });
      } else {
        const {
          password: customerPassword,
          name,
          id,
          failed_login_count,
          is_locked,
        } = result[0];
        if (is_locked == 1) {
          return res.json({
            status: "LOCK",
            msg: `This user locked due to failed login more than ${customer_failed_login_limit} times`,
          });
        } else {
          bcrypt.compare(password, customerPassword, function (error, result) {
            if (error) {
              return res.json({ status: "ERROR", msg: error });
            } else {
              if (result) {
                Conn.execute(
                  `UPDATE customer_user SET failed_login_count = 0, is_locked = 0, locked_reason = NULL WHERE id = ?`,
                  [id],
                  function (successLoginError, successLoginResult) {
                    if (successLoginError) {
                      return res.json({
                        status: "ERROR",
                        msg: successLoginError,
                      });
                    } else {
                      const token = jwt.sign(
                        { id: id, phone: phone, name: name },
                        secret,
                        {
                          expiresIn: `${customer_user_login_mins_limit}m`,
                        },
                      );
                      return res.json({ status: "SUCCESS", msg: token });
                    }
                  },
                );
              } else {
                let count = failed_login_count + 1;
                Conn.execute(
                  `UPDATE customer_user SET failed_login_count = ? WHERE id = ?`,
                  [count, id],
                  function (failLoginError, failLoginResult) {
                    if (failLoginError) {
                      return res.json({ status: "ERROR", msg: error });
                    } else {
                      if (count < customer_failed_login_limit) {
                        return res.json({
                          status: "ERROR",
                          msg: "Wrong username or password",
                        });
                      } else {
                        Conn.execute(
                          `UPDATE customer_user SET is_locked = 1, locked_reason = 'This user locked due to failed login more than ${customer_failed_login_limit} times' WHERE id = ?`,
                          [id],
                          function (lockedError, lockedResult) {
                            if (lockedError) {
                              return res.json({
                                status: "ERROR",
                                msg: lockedError,
                              });
                            } else {
                              return res.json({
                                status: "LOCK",
                                msg: `This user locked due to failed login more than ${customer_failed_login_limit} times`,
                              });
                            }
                          },
                        );
                      }
                    }
                  },
                );
              }
            }
          });
        }
      }
    },
  );
};

module.exports = {
  CustomerLogin,
};
