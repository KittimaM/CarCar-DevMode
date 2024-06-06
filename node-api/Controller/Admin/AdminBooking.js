var jwt = require("jsonwebtoken");
const Conn = require("../../db");
const secret = process.env.SECRET_WORD;

const AdminBooking = (req, res, next) => {
  Conn.execute("SELECT * FROM booking", function (error, results) {
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

const AdminAddBooking = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, secret);
    const { id, username } = decoded;
    const {
      car_no,
      car_size_id,
      car_size,
      customer_name,
      customer_phone,
      service,
      payment_type_id,
      car_color,
      start_service_datetime,
      end_service_datetime,
      service_usetime,
      service_price,
    } = req.body;

    Conn.execute(
      `INSERT INTO booking(car_no, car_size_id, car_size, customer_name, customer_phone, service, payment_type_id, created_by_id, created_by, car_color, start_service_datetime, end_service_datetime, service_usetime, service_price) 
      VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        car_no,
        car_size_id,
        car_size,
        customer_name,
        customer_phone,
        service,
        payment_type_id,
        id,
        username,
        car_color,
        start_service_datetime,
        end_service_datetime,
        service_usetime,
        service_price,
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

const AdminUpdateStatusBooking = (req, res, next) => {
  const { booking_id, processing_status } = req.body;
  Conn.execute(
    `UPDATE booking SET processing_status = ? WHERE id = ?`,
    [processing_status, booking_id],
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
  AdminBooking,
  AdminAddBooking,
  AdminUpdateStatusBooking,
};
