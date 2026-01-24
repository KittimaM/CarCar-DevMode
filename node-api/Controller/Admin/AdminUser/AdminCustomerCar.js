var bcrypt = require("bcrypt");
const Conn = require("../../../db");
const saltRounds = 10;

const AdminGetAllCustomerCar = (req, res, next) => {
  Conn.execute("SELECT * FROM customer_car", function (error, results) {
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

const AdminAddCustomerCar = (req, res, next) => {
  const {
    plate_no,
    prefix,
    postfix,
    province,
    brand,
    model,
    color,
    size_id,
    customer_id,
  } = req.body;
  Conn.execute(
    `INSERT INTO customer_car (plate_no, prefix, postfix, province, brand, model, color, size_id, customer_id) VALUES (?,?,?,?,?,?,?,?,?)`,
    [
      plate_no,
      prefix,
      postfix,
      province,
      brand,
      model,
      color,
      size_id,
      customer_id,
    ],
    function (error, result) {
      if (error) {
        return res.json({ status: "ERROR", msg: error });
      } else {
        const insertId = result.insertId;
        return res.json({ status: "SUCCESS", msg: insertId });
      }
    },
  );
};

const AdminUpdateCustomerCar = (req, res, next) => {
  const {
    id,
    plate_no,
    prefix,
    postfix,
    province,
    brand,
    model,
    color,
    size_id,
    customer_id,
  } = req.body;
  Conn.execute(
    `UPDATE customer_car SET plate_no = ? , prefix = ?, postfix = ?, province = ?, brand = ?, model = ?, color = ?, size_id = ?, customer_id = ? WHERE id = ?`,
    [
      plate_no,
      prefix,
      postfix,
      province,
      brand,
      model,
      color,
      size_id,
      customer_id,
      id,
    ],
    function (error, result) {
      if (error) {
        return res.json({ status: "ERROR", msg: error });
      } else {
        return res.json({ status: "SUCCESS", msg: "SUCCESS" });
      }
    },
  );
};

const AdminDeleteCustomerCar = (req, res, next) => {
  const { id } = req.body;
  Conn.execute(
    "DELETE FROM customer_car WHERE id = ?",
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
  AdminGetAllCustomerCar,
  AdminAddCustomerCar,
  AdminUpdateCustomerCar,
  AdminDeleteCustomerCar,
};
