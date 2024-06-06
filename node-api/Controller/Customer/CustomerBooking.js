var jwt = require("jsonwebtoken");
const Conn = require("../../db");
const secret = process.env.SECRET_WORD;

const CustomerBooking = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, secret);
    const { id, phone, name } = decoded;
    const {
      plate_no,
      size_id,
      size,
      color,
      service,
      service_usetime,
      service_price,
      start_service_datetime,
      end_service_datetime,
      payment_type_id,
    } = req.body;

    Conn.execute(
      `INSERT INTO booking(car_no, car_size_id, car_size, car_color, customer_phone, customer_name, service, service_usetime, service_price, start_service_datetime, end_service_datetime, payment_type_id, created_by_id, created_by) 
      VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        plate_no,
        size_id,
        size,
        color,
        phone,
        name,
        service,
        service_usetime,
        service_price,
        start_service_datetime,
        end_service_datetime,
        payment_type_id,
        id,
        name,
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
  } catch (err) {
    res.json({ status: "ERROR", msg: "token expired" });
  }
};

const CustomerGetServiceChoice = (req, res, next) => {
  const { car_size_id } = req.body;
  Conn.execute(
    `SELECT * FROM service WHERE car_size_id = ? AND is_available = 1`,
    [car_size_id],
    function (error, results) {
      if (error) {
        res.json({ status: "ERROR", msg: error });
      } else if (results.length == 0) {
        res.json({ status: "NO DATA", msg: "NO DATA" });
      } else {
        res.json({ status: "SUCCESS", msg: results });
      }
    }
  );
};

const CustomerGetAllBooking = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, secret);
    const { phone, name } = decoded;
    Conn.execute(
      "SELECT * FROM booking WHERE customer_phone = ?",
      [phone],
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
  } catch (err) {
    res.json({ status: "ERROR", msg: "token expired" });
  }
};

const CustomerDeleteBooking = (req, res, next) => {
  const { id } = req.body;
  Conn.execute(
    "DELETE FROM booking WHERE id = ?",
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
  CustomerBooking,
  CustomerGetServiceChoice,
  CustomerGetAllBooking,
  CustomerDeleteBooking,
};
