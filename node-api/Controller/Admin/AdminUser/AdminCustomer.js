var bcrypt = require("bcrypt");
const Conn = require("../../../db");
const saltRounds = 10;

const AdminGetAllCustomer = (req, res, next) => {
  Conn.execute("SELECT * FROM customer_user", function (error, results) {
    if (error) {
      return res.json({ status: "ERROR", msg: error });
    }
    if (results.length == 0) {
      return res.json({ status: "NO DATA", msg: "NO DATA" });
    } else {
      return res.json({ status: "SUCCESS", msg: results });
    }
  });
};

const AdminAddCustomer = (req, res, next) => {
  const { phone, name, password } = req.body;
  bcrypt.hash(password, saltRounds, function (error, hash) {
    if (error) {
      return res.json({ status: "ERROR", msg: error });
    } else {
      Conn.execute(
        `INSERT INTO customer_user (phone, name, password) VALUES (?,?,?)`,
        [phone, name, hash],
        function (error, result) {
          if (error) {
            return res.json({ status: "ERROR", msg: error });
          } else {
            const insertId = result.insertId;
            return res.json({ status: "SUCCESS", msg: insertId });
          }
        },
      );
    }
  });
};

const AdminUpdateCustomer = (req, res, next) => {
  const { id, phone, name, password } = req.body;
  bcrypt.hash(password, saltRounds, function (error, hash) {
    if (error) {
      return res.json({ status: "ERROR", msg: error });
    } else {
      Conn.execute(
        `UPDATE customer_user SET phone = ? , name = ?, password = ? WHERE id = ?`,
        [phone, name, hash, id],
        function (error, result) {
          if (error) {
            return res.json({ status: "ERROR", msg: error });
          } else {
            return res.json({ status: "SUCCESS", msg: "SUCCESS" });
          }
        },
      );
    }
  });
};

const AdminDeleteCustomer = (req, res, next) => {
  const { id } = req.body;
  Conn.execute(
    "DELETE FROM customer_user WHERE id = ?",
    [id],
    function (error, result) {
      if (error) {
        return res.json({ status: "ERROR", msg: error });
      } else {
        return res.json({ status: "SUCCESS", msg: "SUCCESS" });
      }
    },
  );
};

const AdminActiveCustomer = (req, res, next) => {
  const { id } = req.body;
  Conn.execute(
    "UPDATE customer_user SET is_active = 1 WHERE id = ?",
    [id],
    function (error, result) {
      if (error) {
        return res.json({ status: "ERROR", msg: error });
      } else {
        return res.json({ status: "SUCCESS", msg: "SUCCESS" });
      }
    },
  );
};

const AdminUnlockCustomer = (req, res, next) => {
  const { id } = req.body;
  Conn.execute(
    `UPDATE customer_user SET is_locked = 0, failed_login_count = 0, locked_reason = NULL WHERE id = ?`,
    [id],
    function (error, result) {
      if (error) {
        return res.json({ status: "ERROR", msg: error });
      } else {
        return res.json({ status: "SUCCESS", msg: "SUCCESS" });
      }
    },
  );
};

module.exports = {
  AdminGetAllCustomer,
  AdminAddCustomer,
  AdminUpdateCustomer,
  AdminDeleteCustomer,
  AdminActiveCustomer,
  AdminUnlockCustomer,
};
