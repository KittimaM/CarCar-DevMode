var bcrypt = require("bcrypt");
const Conn = require("../../../db");
const saltRounds = 10;

const AdminGetAllCustomer = (req, res, next) => {
  Conn.execute("SELECT * FROM customer", function (error, results) {
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

const AdminAddCustomer = (req, res, next) => {
  const { phone, name, password } = req.body;
  bcrypt.hash(password, saltRounds, function (error, hash) {
    if (error) {
      res.json({ status: "ERROR", msg: error });
    } else {
      Conn.execute(
        `INSERT INTO customer (phone, name, password) VALUES (?,?,?)`,
        [phone, name, hash],
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

const AdminUpdateCustomer = (req, res, next) => {
  const { id, phone, name, password } = req.body;
  bcrypt.hash(password, saltRounds, function (error, hash) {
    if (error) {
      res.json({ status: "ERROR", msg: error });
    } else {
      Conn.execute(
        `UPDATE customer SET phone = ? , name = ?, password = ? WHERE id = ?`,
        [phone, name, hash, id],
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

const AdminDeleteCustomer = (req, res, next) => {
  const { id } = req.body;
  Conn.execute(
    "DELETE FROM customer WHERE id = ?",
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
  AdminGetAllCustomer,
  AdminAddCustomer,
  AdminUpdateCustomer,
  AdminDeleteCustomer,
};
