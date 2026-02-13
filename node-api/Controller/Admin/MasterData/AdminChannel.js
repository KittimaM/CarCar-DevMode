const Conn = require("../../../db");

const AdminGetChannel = (req, res, next) => {
  Conn.execute(
    `SELECT cs.channel_id, cs.service_id, c.name AS channel_name, c.is_available AS channel_is_available, s.name AS service_name, c.max_capacity, c_schedule.day_of_week, c_schedule.start_time, c_schedule.end_time, car_size.size AS car_size FROM channel c JOIN channel_service cs ON cs.channel_id = c.id JOIN service s ON cs.service_id = s.id JOIN channel_schedule c_schedule ON c_schedule.channel_id = c.id JOIN car_size ON s.car_size_id = car_size.id`,
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

const AdminAddChannel = (req, res, next) => {
  const { name, max_capacity, service_ids, schedule } = req.body;
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
        "INSERT INTO channel (name, max_capacity) VALUES (?, ?)",
        [name, max_capacity],
        function (error, result) {
          if (error) {
            return connection.rollback(() => {
              connection.release();
              if (error.code === "ER_DUP_ENTRY") {
                res.json({ status: "WARNING", msg: "Already In System" });
              } else {
                res.json({ status: "ERROR", msg: error });
              }
            });
          }
          const channel_id = result.insertId;
          const values = service_ids.map((service) => [channel_id, service]);

          connection.query(
            "INSERT INTO channel_service (channel_id, service_id) VALUES ?",
            [values],
            function (error) {
              if (error) {
                return connection.rollback(() => {
                  connection.release();
                  res.json({ status: "ERROR", msg: error });
                });
              }

              const hasValidSchedule = schedule.some(
                (s) => s.start_time && s.end_time,
              );

              if (!hasValidSchedule) {
                return connection.rollback(() => {
                  connection.release();
                  res.json({
                    status: "ERROR",
                    msg: "A least one schedule is required",
                  });
                });
              }

              if (!Array.isArray(schedule) || schedule.length === 0) {
                return connection.commit(function (error) {
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
              }
              const scheduleValues = schedule.map((s) => [
                channel_id,
                s.day_of_week,
                s.start_time,
                s.end_time,
              ]);
              connection.query(
                "INSERT INTO channel_schedule (channel_id, day_of_week, start_time, end_time) VALUES ?",
                [scheduleValues],
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
                }
              );
            }
          );
        }
      );
    });
  });
};

const AdminDeleteChannel = (req, res, next) => {
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
        "DELETE FROM channel_service WHERE channel_id = ?",
        [id],
        function (error) {
          if (error) {
            return connection.rollback(() => {
              connection.release();
              res.json({ status: "ERROR", msg: error });
            });
          }
          connection.execute(
            "DELETE FROM channel_schedule WHERE channel_id = ?",
            [id],
            function (error) {
              if (error) {
                return connection.rollback(() => {
                  connection.release();
                  res.json({ status: "ERROR", msg: error });
                });
              }
              connection.execute(
                "DELETE FROM channel WHERE id = ?",
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
                }
              );
            }
          );
        }
      );
    });
  });
};

const AdminUpdateChannel = (req, res, next) => {
  const { id, name, max_capacity, service_ids, schedule } = req.body;
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
        "UPDATE channel SET name = ?, max_capacity = ? WHERE id = ?",
        [name, max_capacity, id],
        function (error) {
          if (error) {
            return connection.rollback(() => {
              connection.release();
              if (error.code === "ER_DUP_ENTRY") {
                res.json({ status: "WARNING", msg: "Already In System" });
              } else {
                res.json({ status: "ERROR", msg: error });
              }
            });
          }
          connection.execute(
            "DELETE FROM channel_service WHERE channel_id = ?",
            [id],
            function (error) {
              if (error) {
                return connection.rollback(() => {
                  connection.release();
                  res.json({ status: "ERROR", msg: error });
                });
              }
              const values = service_ids.map((service) => [id, service]);
              connection.query(
                "INSERT INTO channel_service (channel_id, service_id) VALUES ?",
                [values],
                function (error) {
                  if (error) {
                    return connection.rollback(() => {
                      connection.release();
                      res.json({ status: "ERROR", msg: error });
                    });
                  }
                  connection.execute(
                    "DELETE FROM channel_schedule WHERE channel_id = ?",
                    [id],
                    function (error) {
                      if (error) {
                        return connection.rollback(() => {
                          connection.release();
                          res.json({ status: "ERROR", msg: error });
                        });
                      }
                      const scheduleRows = Array.isArray(schedule)
                        ? schedule.filter((s) => s.start_time && s.end_time)
                        : [];
                      if (scheduleRows.length === 0) {
                        return connection.commit(function (error) {
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
                      }
                      const scheduleValues = scheduleRows.map((s) => [
                        id,
                        s.day_of_week,
                        s.start_time,
                        s.end_time,
                      ]);
                      connection.query(
                        "INSERT INTO channel_schedule (channel_id, day_of_week, start_time, end_time) VALUES ?",
                        [scheduleValues],
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
                        }
                      );
                    }
                  );
                }
              );
            }
          );
        }
      );
    });
  });
};

const UpdateChannelAvailable = (req, res, next) => {
  const { id, is_available } = req.body;
  Conn.execute(
    "UPDATE channel SET is_available = ? WHERE id = ? ",
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

module.exports = {
  AdminGetChannel,
  AdminAddChannel,
  AdminDeleteChannel,
  AdminUpdateChannel,
  UpdateChannelAvailable,
};
