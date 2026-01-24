var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const Conn = require("../../db");
const secret = process.env.SECRET_WORD;

const AdminLogin = (req, res, next) => {
  const {
    username: userName,
    password: passWord,
    staff_failed_login_limit,
    staff_user_login_mins_limit,
  } = req.body;
  Conn.execute(
    `SELECT id, username, password, role_id, failed_login_count, is_locked, role_name FROM staff_user WHERE username = ? LIMIT 1`,
    [userName],
    function (error, result) {
      if (error) {
        return res.json({ status: "ERROR", msg: error });
      } else if (result.length == 0) {
        return res.json({ status: "ERROR", msg: "Wrong username or password" });
      } else {
        const {
          id,
          username,
          password,
          role_id,
          failed_login_count,
          is_locked,
          role_name,
        } = result[0];
        if (is_locked == 1) {
          return res.json({
            status: "LOCK",
            msg: `This user locked due to failed login more than ${staff_failed_login_limit} times`,
          });
        } else {
          bcrypt.compare(passWord, password, function (error, result) {
            if (error) {
              return res.json({ status: "ERROR", msg: error });
            } else {
              if (result) {
                Conn.execute(
                  `UPDATE staff_user SET failed_login_count = 0, is_locked = 0, locked_reason = NULL, latest_logged_in = CURRENT_TIMESTAMP WHERE id = ?`,
                  [id],
                  function (successLoginError, successLoginResult) {
                    if (successLoginError) {
                      return res.json({
                        status: "ERROR",
                        msg: successLoginError,
                      });
                    } else {
                      const token = jwt.sign(
                        { id: id, username: username, role_id: role_id },
                        secret,
                        { expiresIn: `${staff_user_login_mins_limit}m` },
                      );
                      return res.json({
                        status: "SUCCESS",
                        msg: {
                          token: token,
                          username: username,
                          role_name: role_name,
                        },
                      });
                    }
                  },
                );
              } else {
                let count = failed_login_count + 1;
                Conn.execute(
                  `UPDATE staff_user SET failed_login_count = ? WHERE id = ?`,
                  [count, id],
                  function (failLoginError, failLoginResult) {
                    if (failLoginError) {
                      return res.json({ status: "ERROR", msg: error });
                    } else {
                      if (count < staff_failed_login_limit) {
                        return res.json({
                          status: "ERROR",
                          msg: "Wrong username or password",
                        });
                      } else {
                        Conn.execute(
                          `UPDATE staff_user SET is_locked = 1, locked_reason = 'This user locked due to failed login more than ${staff_failed_login_limit} times' WHERE id = ?`,
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
                                msg: `This user locked due to failed login more than ${staff_failed_login_limit} times`,
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
  AdminLogin,
};
