const Conn = require("../../../db");

const GetAllServiceRates = (req, res, next) => {
  Conn.execute(
    `
        SELECT 
            scs.*, service.name AS service_name, car_size.size
        FROM
            service_car_size scs
                JOIN
            service ON service.id = scs.service_id
                JOIN
            car_size ON car_size.id = scs.car_size_id
    `,
    function (error, results) {
      if (error) {
        return res.json({ status: "ERROR", msg: error });
      }
      if (results.length === 0) {
        return res.json({ status: "NO DATA", msg: "NO DATA" });
      } else {
        return res.json({ status: "SUCCESS", msg: results });
      }
    },
  );
};

const PostAddServiceRates = (req, res, next) => {
  const { service_id, car_size_id, duration_minute, price, required_staff } =
    req.body;
  Conn.execute(
    `INSERT INTO service_car_size (service_id, car_size_id, duration_minute, price, required_staff) VALUES (?, ?, ?, ?, ?)`,
    [service_id, car_size_id, duration_minute, price, required_staff],
    function (error) {
      if (error) {
        if (error.code === "ER_DUP_ENTRY") {
          return res.json({
            status: "WARNING",
            msg: "This service and car size already have a service rate",
          });
        } else {
          return res.json({ status: "ERROR", msg: error });
        }
      } else {
        return res.json({ status: "SUCCESS", msg: "Successfully Added" });
      }
    },
  );
};

const PostDeleteServiceRates = (req, res, next) => {
  const { id } = req.body;
  Conn.execute(
    `DELETE FROM service_car_size WHERE id = ?`,
    [id],
    function (error) {
      if (error) {
        return res.json({ status: "ERROR", msg: error });
      } else {
        return res.json({ status: "SUCCESS", msg: "Successfully Deleted" });
      }
    },
  );
};

const PutUpdateServiceRates = (req, res, next) => {
  const {
    id,
    service_id,
    car_size_id,
    duration_minute,
    price,
    required_staff,
  } = req.body;
  Conn.execute(
    `UPDATE service_car_size SET service_id = ?, car_size_id = ?, duration_minute = ?, price = ?, required_staff = ? WHERE id = ?`,
    [service_id, car_size_id, duration_minute, price, required_staff, id],
    function (error) {
      if (error) {
        if (error.code === "ER_DUP_ENTRY") {
          return res.json({
            status: "WARNING",
            msg: "This service and car size already have a service rate",
          });
        } else {
          return res.json({ status: "ERROR", msg: error });
        }
      } else {
        return res.json({ status: "SUCCESS", msg: "Successfully Updated" });
      }
    },
  );
};

module.exports = {
  GetAllServiceRates,
  PostAddServiceRates,
  PostDeleteServiceRates,
  PutUpdateServiceRates,
};
