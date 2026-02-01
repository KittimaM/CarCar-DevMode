const Conn = require("../../db");

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

const AdminAddService = (req, res, next) => {
  const {
    name,
    car_size_id,
    duration_minute,
    price,
    required_staff,
    staff_ids,
  } = req.body;
  Conn.beginTransaction(function (error) {
    if (error) {
      return res.json({ status: "ERROR", msg: error });
    }
    Conn.execute(
      "INSERT INTO service (name, car_size_id, duration_minute, price, required_staff) VALUES (?,?,?,?,?)",
      [name, car_size_id, duration_minute, price, required_staff],
      function (error, result) {
        if (error) {
          return Conn.rollback(() => {
            if (error.code === "ER_DUP_ENTRY") {
              res.json({ status: "WARNING", msg: "Already In System" });
            } else {
              res.json({ status: "ERROR", msg: error });
            }
          });
        }
        const service_id = result.insertId;
        const values = staff_ids.map((staff) => [service_id, staff]);

        Conn.query(
          "INSERT INTO staff_service (service_id, staff_id) VALUES ?",
          [values],
          function (error) {
            if (error) {
              return Conn.rollback(() => {
                res.json({ status: "ERROR", msg: error });
              });
            }
            Conn.commit(function (error) {
              if (error) {
                return Conn.rollback(() => {
                  res.json({ status: "ERROR", msg: error });
                });
              }
              res.json({
                status: "SUCCESS",
                msg: "Successfully Added",
              });
            });
          }
        );
      }
    );
  });
};

const AdminDeleteService = (req, res, next) => {
  const { id } = req.body;
  Conn.beginTransaction(function (error) {
    if (error) {
      return res.json({ status: "ERROR", msg: error });
    }
    Conn.execute(
      "DELETE FROM staff_service WHERE service_id = ?",
      [id],
      function (error) {
        if (error) {
          return Conn.rollback(() => {
            res.json({ status: "ERROR", msg: error });
          });
        }
        Conn.execute(
          "DELETE FROM service WHERE id = ?",
          [id],
          function (error) {
            if (error) {
              return Conn.rollback(() => {
                if (error.code === "ER_ROW_IS_REFERENCED_2") {
                  res.json({ status: "WARNING", msg: "Currently In Use" });
                } else {
                  res.json({ status: "ERROR", msg: error });
                }
              });
            }
            Conn.commit(function (error) {
              if (error) {
                return Conn.rollback(() => {
                  res.json({ status: "ERROR", msg: error });
                });
              }
              res.json({
                status: "SUCCESS",
                msg: "Successfully Deleted",
              });
            });
          }
        );
      }
    );
  });
};

const AdminUpdateService = (req, res, next) => {
  const {
    id,
    name,
    car_size_id,
    duration_minute,
    price,
    required_staff,
    staff_ids,
  } = req.body;
  Conn.beginTransaction(function (error) {
    if (error) {
      return res.json({ status: "ERROR", msg: error });
    }
    Conn.execute(
      "UPDATE service SET name = ? , car_size_id = ?, duration_minute = ?, price = ?,  required_staff = ? WHERE id = ?",
      [name, car_size_id, duration_minute, price, required_staff, id],
      function (error) {
        if (error) {
          return Conn.rollback(() => {
            if (error.code === "ER_DUP_ENTRY") {
              res.json({ status: "WARNING", msg: "Already In System" });
            } else {
              res.json({ status: "ERROR", msg: error });
            }
          });
        }
        Conn.execute(
          "DELETE FROM staff_service WHERE service_id = ?",
          [id],
          function (error) {
            if (error) {
              return Conn.rollback(() => {
                res.json({ status: "ERROR", msg: error });
              });
            }
            const values = staff_ids.map((staff) => [staff, id]);
            Conn.query(
              "INSERT INTO staff_service (staff_id, service_id) VALUES ?",
              [values],
              function (error) {
                if (error) {
                  return Conn.rollback(() => {
                    res.json({ status: "ERROR", msg: error });
                  });
                }
                Conn.commit(function (error) {
                  if (error) {
                    return Conn.rollback(() => {
                      res.json({ status: "ERROR", msg: error });
                    });
                  }
                  res.json({
                    status: "SUCCESS",
                    msg: "Successfully Updated",
                  });
                });
              }
            );
          }
        );
      }
    );
  });
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
    }
  );
};

const GetAvailableService = (req, res, next) => {
  Conn.execute(
    "SELECT * FROM service WHERE is_available = 1",
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
