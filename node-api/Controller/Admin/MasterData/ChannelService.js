const Conn = require("../../../db");

const AdminService = (req, res, next) => {
  Conn.execute(
    "SELECT ss.service_id, ss.staff_id, s.name, s.car_size_id, cs.size, s.duration_minute, s.price, s.required_staff, s.is_available, su.username FROM service s JOIN staff_service ss ON ss.service_id = s.id JOIN staff_user su ON su.id = ss.staff_id JOIN car_size cs ON cs.id = s.car_size_id",
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


module.exports = {
  AdminService,
  AdminAddService,
  AdminDeleteService,
  AdminUpdateService,
  UpdateServiceAvailable,
  GetAvailableService,
};
