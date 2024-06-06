var jwt = require("jsonwebtoken");
const Conn = require("../../db");
const secret = process.env.SECRET_WORD;

const CustomerCar = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const { id } = jwt.verify(token, secret);
    Conn.execute(
      `SELECT * FROM customer_car WHERE customer_id = ? AND deleted_at IS NULL `,
      [id],
      function (error, results) {
        if (error) {
          res.json({ status: "ERROR", msg: error });
        }
        if (results.length == 0) {
          res.json({ status: "NO DATA", msg: "NO DATA" });
        } else {
          res.json({ status: "SUCCESS", msg: results });
        }
      }
    );
  } catch (error) {
    res.json({ status: "ERROR", msg: "token expired" });
  }
};

const CustomerAddCustomerCar = (req, res, next) => {
  try {
    const {
      plate_no,
      prefix,
      postfix,
      province,
      brand,
      model,
      size_id,
      color,
    } = req.body;
    const token = req.headers.authorization.split(" ")[1];
    const { id } = jwt.verify(token, secret);
    Conn.execute(
      `INSERT INTO 
      customer_car(customer_id, plate_no, prefix, postfix, province, brand, model, size_id, color) 
      VALUES (?,?,?,?,?,?,?,?,?)`,
      [
        id,
        plate_no,
        prefix,
        postfix,
        province,
        brand,
        model,
        size_id,
        color,
      ],
      function (error, result) {
        if (error) {
          res.json({ status: "ERROR", msg: error });
        } else {
          const insertId = result.insertId;
          res.json({ status: "SUCCESS", msg: insertId });
        }
      }
    );
  } catch (error) {
    res.json({ status: "ERROR", msg: "token expired" });
  }
};

const CustomerDeleteCustomerCar = (req, res, next) => {
  const { id } = req.body;
  Conn.execute(
    `UPDATE customer_car SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?`,
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

const CustomerUpdateCustomerCar = (req, res, next) => {
  const {
    id,
    plate_no,
    prefix,
    postfix,
    province,
    brand,
    model,
    size_id,
    size,
    color,
  } = req.body;
  Conn.execute(
    `UPDATE customer_car 
      SET plate_no = ?, prefix = ?, postfix = ?, province = ?, brand = ?, model = ?, size_id = ?, size = ?, color = ? 
      WHERE id = ?`,
    [
      plate_no,
      prefix,
      postfix,
      province,
      brand,
      model,
      size_id,
      size,
      color,
      id,
    ],
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
  CustomerCar,
  CustomerAddCustomerCar,
  CustomerDeleteCustomerCar,
  CustomerUpdateCustomerCar,
};
