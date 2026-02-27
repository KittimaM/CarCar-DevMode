var jwt = require("jsonwebtoken");
const Conn = require("../../db");
const secret = process.env.SECRET_WORD;

const CustomerCar = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const { id } = jwt.verify(token, secret);
    Conn.execute(
      `SELECT * FROM customer_car WHERE customer_id = ? `,
      [id],
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
  } catch (error) {
    return res.json({ status: "ERROR", msg: "token expired" });
  }
};

const CustomerAddCustomerCar = (req, res, next) => {
  try {
    const { plate_no, province_id, brand, model, size_id, color } = req.body;
    const token = req.headers.authorization.split(" ")[1];
    const { id } = jwt.verify(token, secret);
    Conn.execute(
      `INSERT INTO customer_car(customer_id, plate_no, province_id, brand, model, size_id, color) VALUES (?,?,?,?,?,?,?)`,
      [id, plate_no, province_id, brand || "", model || null, size_id, color],
      function (error, result) {
        if (error) {
          return res.json({ status: "ERROR", msg: error });
        } else {
          const insertId = result.insertId;
          return res.json({ status: "SUCCESS", msg: insertId });
        }
      }
    );
  } catch (error) {
    return res.json({ status: "ERROR", msg: "token expired" });
  }
};

const CustomerDeleteCustomerCar = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.json({ status: "ERROR", msg: "token expired" });
    const { id } = jwt.verify(token, secret);
    const { id: carId } = req.body;
    if (!carId) return res.json({ status: "ERROR", msg: "id required" });
    Conn.execute(
      `DELETE FROM customer_car WHERE id = ? AND customer_id = ?`,
      [carId, id],
      function (error, result) {
        if (error) return res.json({ status: "ERROR", msg: error });
        if (result.affectedRows === 0) return res.json({ status: "WARNING", msg: "ไม่พบรถหรือไม่มีสิทธิ์ลบ" });
        return res.json({ status: "SUCCESS", msg: "SUCCESS" });
      }
    );
  } catch (err) {
    return res.json({ status: "ERROR", msg: "token expired" });
  }
};

const CustomerUpdateCustomerCar = (req, res, next) => {
  try {
    const { id, plate_no, province_id, brand, model, size_id, color } = req.body;
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.json({ status: "ERROR", msg: "token expired" });
    const { id: customerId } = jwt.verify(token, secret);
    if (!id) return res.json({ status: "ERROR", msg: "id required" });
    Conn.execute(
      `UPDATE customer_car 
        SET plate_no = ?, province_id = ?, brand = ?, model = ?, size_id = ?, color = ? 
        WHERE id = ? AND customer_id = ?`,
      [plate_no, province_id, brand || "", model || null, size_id, color, id, customerId],
      function (error, result) {
        if (error) return res.json({ status: "ERROR", msg: error });
        if (result.affectedRows === 0) return res.json({ status: "WARNING", msg: "ไม่พบรถหรือไม่มีสิทธิ์แก้ไข" });
        return res.json({ status: "SUCCESS", msg: "SUCCESS" });
      }
    );
  } catch (err) {
    return res.json({ status: "ERROR", msg: "token expired" });
  }
};

module.exports = {
  CustomerCar,
  CustomerAddCustomerCar,
  CustomerDeleteCustomerCar,
  CustomerUpdateCustomerCar,
};
