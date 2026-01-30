const Conn = require("../../db");

const AdminService = (req, res, next) => {
  Conn.execute(
    "SELECT service.*, car_size.size AS car_size FROM service JOIN car_size ON car_size.id = service.car_size_id",
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

const AdminAddService = (req, res, next) => {
  const { service, description, car_size_id, used_time, price, used_people } =
    req.body;
  Conn.execute(
    "INSERT INTO service (service, description, car_size_id, used_time, price, used_people) VALUES (?,?,?,?,?,?)",
    [service, description, car_size_id, used_time, price, used_people],
    function (error) {
      if (error) {
        return res.json({ status: "ERROR", msg: error });
      } else {
        return res.json({ status: "SUCCESS", msg: "Successfully Add" });
      }
    },
  );
};

const AdminDeleteService = (req, res, next) => {
  const { id } = req.body;
  Conn.execute("DELETE FROM service WHERE id = ?", [id], function (error) {
    if (error) {
      return res.json({ status: "ERROR", msg: error });
    } else {
      return res.json({ status: "SUCCESS", msg: "Successfully Deleted" });
    }
  });
};

const AdminUpdateService = (req, res, next) => {
  const {
    id,
    service,
    description,
    car_size_id,
    used_time,
    price,
    is_available,
    used_people,
  } = req.body;
  Conn.execute(
    "UPDATE service SET service = ? , description = ? , car_size_id = ?, used_time = ?, price = ?, is_available = ?, used_people = ? WHERE id = ?",
    [
      service,
      description,
      car_size_id,
      used_time,
      price,
      is_available,
      used_people,
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

const UpdateServiceAvailable = (req, res, next) => {
  const { id, is_available } = req.body;
  Conn.execute(
    "UPDATE service SET is_available = ? WHERE id = ? ",
    [is_available, id],
    function (error) {
      if (error) {
        return res.json({ status: "ERROR", msg: error });
      } else {
        return res.json({ status: "SUCCESS", msg: "Successfully Updated" });
      }
    },
  );
};

module.exports = {
  AdminService,
  AdminAddService,
  AdminDeleteService,
  AdminUpdateService,
  UpdateServiceAvailable
};
