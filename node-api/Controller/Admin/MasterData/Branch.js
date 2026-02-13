const Conn = require("../../../db");

const GetAllBranch = (req, res, next) => {
  Conn.execute(
    "SELECT * FROM branch",
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
  const {
    name,
    car_size_id,
    duration_minute,
    price,
    required_staff,
    staff_ids,
  } = req.body;
  Conn.getConnection(function (err, connection) {
    if (err) {
      return res.json({ status: "ERROR", msg: err });
    }
    connection.beginTransaction(function (error) {
      if (error) {
        connection.release();
        return res.json({ status: "ERROR", msg: error });
      }
      connection.execute(
        "INSERT INTO service (name, car_size_id, duration_minute, price, required_staff) VALUES (?,?,?,?,?)",
        [name, car_size_id, duration_minute, price, required_staff],
        function (error, result) {
          if (error) {
            return connection.rollback(() => {
              connection.release();
              if (error.code === "ER_DUP_ENTRY") {
                res.json({
                  status: "WARNING",
                  msg: "This Service Already Exists",
                });
              } else {
                res.json({ status: "ERROR", msg: error });
              }
            });
          }
          const service_id = result.insertId;
          const values = staff_ids.map((staff) => [service_id, staff]);

          connection.query(
            "INSERT INTO staff_service (service_id, staff_id) VALUES ?",
            [values],
            function (error) {
              if (error) {
                return connection.rollback(() => {
                  connection.release();
                  res.json({ status: "ERROR", msg: error });
                });
              }
              connection.commit(function (error) {
                if (error) {
                  return connection.rollback(() => {
                    connection.release();
                    res.json({ status: "ERROR", msg: error });
                  });
                }
                connection.release();
                res.json({
                  status: "SUCCESS",
                  msg: "Successfully Added",
                });
              });
            },
          );
        },
      );
    });
  });
};

const AdminDeleteService = (req, res, next) => {
  const { id } = req.body;
  Conn.getConnection(function (err, connection) {
    if (err) {
      return res.json({ status: "ERROR", msg: err });
    }
    connection.beginTransaction(function (error) {
      if (error) {
        connection.release();
        return res.json({ status: "ERROR", msg: error });
      }
      connection.execute(
        "DELETE FROM staff_service WHERE service_id = ?",
        [id],
        function (error) {
          if (error) {
            return connection.rollback(() => {
              connection.release();
              res.json({ status: "ERROR", msg: error });
            });
          }
          connection.execute(
            "DELETE FROM service WHERE id = ?",
            [id],
            function (error) {
              if (error) {
                return connection.rollback(() => {
                  connection.release();
                  if (error.code === "ER_ROW_IS_REFERENCED_2") {
                    res.json({ status: "WARNING", msg: "Currently In Use" });
                  } else {
                    res.json({ status: "ERROR", msg: error });
                  }
                });
              }
              connection.commit(function (error) {
                if (error) {
                  return connection.rollback(() => {
                    connection.release();
                    res.json({ status: "ERROR", msg: error });
                  });
                }
                connection.release();
                res.json({
                  status: "SUCCESS",
                  msg: "Successfully Deleted",
                });
              });
            },
          );
        },
      );
    });
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
  Conn.getConnection(function (err, connection) {
    if (err) {
      return res.json({ status: "ERROR", msg: err });
    }
    connection.beginTransaction(function (error) {
      if (error) {
        connection.release();
        return res.json({ status: "ERROR", msg: error });
      }
      connection.execute(
        "UPDATE service SET name = ? , car_size_id = ?, duration_minute = ?, price = ?,  required_staff = ? WHERE id = ?",
        [name, car_size_id, duration_minute, price, required_staff, id],
        function (error) {
          if (error) {
            return connection.rollback(() => {
              connection.release();
              if (error.code === "ER_DUP_ENTRY") {
                res.json({
                  status: "WARNING",
                  msg: "This Service Already Exists",
                });
              } else {
                res.json({ status: "ERROR", msg: error });
              }
            });
          }
          connection.execute(
            "DELETE FROM staff_service WHERE service_id = ?",
            [id],
            function (error) {
              if (error) {
                return connection.rollback(() => {
                  connection.release();
                  res.json({ status: "ERROR", msg: error });
                });
              }
              const values = staff_ids.map((staff) => [staff, id]);
              connection.query(
                "INSERT INTO staff_service (staff_id, service_id) VALUES ?",
                [values],
                function (error) {
                  if (error) {
                    return connection.rollback(() => {
                      connection.release();
                      res.json({ status: "ERROR", msg: error });
                    });
                  }
                  connection.commit(function (error) {
                    if (error) {
                      return connection.rollback(() => {
                        connection.release();
                        res.json({ status: "ERROR", msg: error });
                      });
                    }
                    connection.release();
                    res.json({
                      status: "SUCCESS",
                      msg: "Successfully Updated",
                    });
                  });
                },
              );
            },
          );
        },
      );
    });
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
    },
  );
};

const GetAvailableService = (req, res, next) => {
  Conn.execute(
    "SELECT s.*, cs.size FROM service s JOIN car_size cs ON s.car_size_id = cs.id WHERE s.is_available = 1",
    function (error, results) {
      if (error) {
        return res.json({ status: "ERROR", msg: error });
      }
      if (results.length === 0) {
        return res.json({ status: "NO DATA", msg: "No Service Available" });
      } else {
        return res.json({ status: "SUCCESS", msg: results });
      }
    },
  );
};

module.exports = {
  GetAllBranch,
};
