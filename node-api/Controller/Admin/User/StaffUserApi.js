var bcrypt = require("bcrypt");
const Conn = require("../../../db");
const saltRounds = 10;

const GetAllStaffUser = (req, res, next) => {
  Conn.execute(
    "SELECT staff_user.* , role.name AS role_name FROM staff_user JOIN role ON role.id = staff_user.role_id",
    function (error, results) {
      if (error) {
        return res.json({ status: "ERROR", msg: error });
      }
      if (results.length === 0) {
        return res.json({ status: "NO DATA", msg: "NO DATA" });
      } else {
        return res.json({ status: "SUCCESS", msg: results });
      }
    }
  );
};

const PostAddStaffUser = (req, res, next) => {
  const { username, name, password, role_id, branch_id} = req.body;
  bcrypt.hash(password, saltRounds, function (error, hash) {
    if (error) {
      return res.json({ status: "ERROR", msg: error });
    } else {
      Conn.execute(
        `INSERT INTO staff_user (username, name , password, role_id, branch_id) VALUES (?,?,?,?,?)`,
        [username, name, hash, role_id, branch_id],
        function (error) {
          if (error) {
            if (error.code === "ER_DUP_ENTRY") {
              return res.json({ status: "WARNING", msg: "Already In System" });
            } else {
              return res.json({ status: "ERROR", msg: error });
            }
          } else {
            return res.json({ status: "SUCCESS", msg: "Successfully Added" });
          }
        }
      );
    }
  });
};

const DeleteStaffUser = (req, res, next) => {
  const { id } = req.body;
  Conn.execute("DELETE FROM staff_user WHERE id = ?", [id], function (error) {
    if (error) {
      if (error.code === "ER_ROW_IS_REFERENCED_2") {
        return res.json({ status: "WARNING", msg: "Currently In Use" });
      } else {
        return res.json({ status: "ERROR", msg: error });
      }
    } else {
      return res.json({ status: "SUCCESS", msg: "Successfully Deleted" });
    }
  });
};

const PutUpdateStaffUser = (req, res, next) => {
  const { id, username, name, password, role_id, isChangePassword } = req.body;

  const handleUpdate = (query, params) => {
    Conn.execute(query, params, function (error) {
      if (error) {
        if (error.code === "ER_DUP_ENTRY") {
          return res.json({
            status: "WARNING",
            msg: "Already In System",
          });
        } else {
          return res.json({ status: "ERROR", msg: error });
        }
      } else {
        return res.json({ status: "SUCCESS", msg: "SUCCESS" });
      }
    });
  };
  if (isChangePassword) {
    bcrypt.hash(password, saltRounds, function (error, hash) {
      if (error) {
        return res.json({ status: "ERROR", msg: error });
      } else {
        handleUpdate(
          `UPDATE staff_user SET username = ? , name = ?, password = ?, role_id = ? WHERE id = ?`,
          [username, name, hash, role_id, id]
        );
      }
    });
  } else {
    handleUpdate(
      `UPDATE staff_user SET username = ? , name = ?, role_id = ? WHERE id = ?`,
      [username, name, role_id, id]
    );
  }
};

const PutUnlockStaffUser = (req, res, next) => {
  const { id } = req.body;
  Conn.execute(
    `UPDATE staff_user SET is_locked = 0, failed_login_count = 0, locked_reason = NULL WHERE id = ?`,
    [id],
    function (error) {
      if (error) {
        return res.json({ status: "ERROR", msg: error });
      } else {
        return res.json({ status: "SUCCESS", msg: "SUCCESS" });
      }
    }
  );
};

const GetStaffUserById = (req, res, next) => {
  const { id } = req.body;
  Conn.execute(
    "SELECT * FROM staff_user WHERE id = ?",
    [id],
    function (error, result) {
      if (error) {
        return res.json({ status: "ERROR", msg: error });
      } else if (result.length === 0) {
        return res.json({ status: "NO DATA", msg: "NO DATA" });
      } else {
        return res.json({ status: "SUCCESS", msg: result[0] });
      }
    }
  );
};

module.exports = {
  GetAllStaffUser,
  PostAddStaffUser,
  DeleteStaffUser,
  PutUpdateStaffUser,
  PutUnlockStaffUser,
  GetStaffUserById,
};
