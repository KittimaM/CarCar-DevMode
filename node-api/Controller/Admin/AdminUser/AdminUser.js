var bcrypt = require("bcrypt");
const Conn = require("../../../db");
const saltRounds = 10;

const AdminUser = (req, res, next) => {
  Conn.execute("SELECT * FROM staff_user", function (error, results) {
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

const AdminAddStaffUser = (req, res, next) => {
  const { username, name, password, role_id } = req.body;
  bcrypt.hash(password, saltRounds, function (error, hash) {
    if (error) {
      res.json({ status: "ERROR", msg: error });
    } else {
      Conn.execute(
        `INSERT INTO staff_user (username, name , password, role_id) VALUES (?,?,?,?)`,
        [username, name, hash, role_id],
        function (error, result) {
          if (error) {
            res.json({ status: "ERROR", msg: error });
          } else {
            const insertId = result.insertId;
            res.json({ status: "SUCCESS", msg: insertId });
          }
        }
      );
    }
  });
};

const AdminDeleteStaffUser = (req, res, next) => {
  const { id } = req.body;
  Conn.execute(
    "DELETE FROM staff_user WHERE id = ?",
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

const AdminUpdateStaffUser = (req, res, next) => {
  const { id, username, name, password, role_id, role_name } = req.body;
  bcrypt.hash(password, saltRounds, function (error, hash) {
    if (error) {
      res.json({ status: "ERROR", msg: error });
    } else {
      Conn.execute(
        `UPDATE staff_user SET username = ? , name = ?, password = ?, role_id = ?, role_name = ? WHERE id = ?`,
        [username, name, hash, role_id, role_name, id],
        function (error, result) {
          if (error) {
            res.json({ status: "ERROR", msg: error });
          } else {
            res.json({ status: "SUCCESS", msg: "SUCCESS" });
          }
        }
      );
    }
  });
};

const AdminActiveStaff = (req, res, next) => {
  const { id } = req.body;
  Conn.execute(
    "UPDATE staff_user SET is_active = 1 WHERE id = ?",
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

const AdminUnlockStaff = (req, res, next) => {
  const { id } = req.body;
  Conn.execute(
    `UPDATE staff_user SET is_locked = 0, failed_login_count = 0, locked_reason = NULL WHERE id = ?`,
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

module.exports = {
  AdminUser,
  AdminAddStaffUser,
  AdminDeleteStaffUser,
  AdminUpdateStaffUser,
  AdminActiveStaff,
  AdminUnlockStaff,
};
