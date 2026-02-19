const Conn = require("../../../db");

const GetAllChannelMatching = (req, res, next) => {
  Conn.execute(
    `
    SELECT 
        cs.channel_id,
        cs.service_car_size_id,
        cs.is_available,
        channel.name AS channel_name,
        branch.name AS branch_name,
        service.name AS service_name,
        car_size.size AS car_size,
        schedule_times.Monday,
        schedule_times.Tuesday,
        schedule_times.Wednesday,
        schedule_times.Thursday,
        schedule_times.Friday,
        schedule_times.Saturday,
        schedule_times.Sunday
    FROM
        channel
            JOIN
        channel_service cs ON cs.channel_id = channel.id
            JOIN
        service_car_size scs ON scs.id = cs.service_car_size_id
            JOIN
        service ON service.id = scs.service_id
            JOIN
        branch ON branch.id = channel.branch_id
            JOIN
        car_size ON car_size.id = scs.car_size_id
            LEFT JOIN
        (SELECT 
            channel_id,
            MAX(CASE WHEN day_of_week = 'Monday' THEN CONCAT(TIME_FORMAT(start_time, '%H:%i'), '-', TIME_FORMAT(end_time, '%H:%i')) END) AS Monday,
            MAX(CASE WHEN day_of_week = 'Tuesday' THEN CONCAT(TIME_FORMAT(start_time, '%H:%i'), '-', TIME_FORMAT(end_time, '%H:%i')) END) AS Tuesday,
            MAX(CASE WHEN day_of_week = 'Wednesday' THEN CONCAT(TIME_FORMAT(start_time, '%H:%i'), '-', TIME_FORMAT(end_time, '%H:%i')) END) AS Wednesday,
            MAX(CASE WHEN day_of_week = 'Thursday' THEN CONCAT(TIME_FORMAT(start_time, '%H:%i'), '-', TIME_FORMAT(end_time, '%H:%i')) END) AS Thursday,
            MAX(CASE WHEN day_of_week = 'Friday' THEN CONCAT(TIME_FORMAT(start_time, '%H:%i'), '-', TIME_FORMAT(end_time, '%H:%i')) END) AS Friday,
            MAX(CASE WHEN day_of_week = 'Saturday' THEN CONCAT(TIME_FORMAT(start_time, '%H:%i'), '-', TIME_FORMAT(end_time, '%H:%i')) END) AS Saturday,
            MAX(CASE WHEN day_of_week = 'Sunday' THEN CONCAT(TIME_FORMAT(start_time, '%H:%i'), '-', TIME_FORMAT(end_time, '%H:%i')) END) AS Sunday
        FROM channel_schedule
        GROUP BY channel_id) schedule_times ON schedule_times.channel_id = channel.id
    `,
    function (error, results) {
      if (error) {
        return res.json({ status: "ERROR", msg: error });
      }
      if (results.length === 0) {
        return res.json({ status: "NO DATA", msg: "No Channel Available" });
      } else {
        return res.json({ status: "SUCCESS", msg: results });
      }
    },
  );
};

const PostAddChannelMatching = (req, res, next) => {
  const { channel_id, service_ids, schedule } = req.body;

  if (!Array.isArray(service_ids) || service_ids.length === 0) {
    return res.json({
      status: "ERROR",
      msg: "At least one service is required",
    });
  }

  const scheduleRows =
    typeof schedule === "object" && schedule !== null
      ? Object.entries(schedule)
          .map(([day_of_week, times]) => ({ day_of_week, ...times }))
          .filter((s) => s.start_time && s.end_time)
      : [];

  if (scheduleRows.length === 0) {
    return res.json({
      status: "ERROR",
      msg: "At least one day time input is required",
    });
  }

  Conn.getConnection(function (err, connection) {
    if (err) {
      return res.json({ status: "ERROR", msg: err });
    }
    connection.beginTransaction(function (error) {
      if (error) {
        connection.release();
        return res.json({ status: "ERROR", msg: error });
      }
      connection.query(
        "INSERT INTO channel_service (channel_id, service_car_size_id) VALUES ?",
        [service_ids.map((id) => [channel_id, id])],
        function (error) {
          if (error) {
            return connection.rollback(() => {
              connection.release();
              if (error.code === "ER_DUP_ENTRY") {
                return res.json({
                  status: "WARNING",
                  msg: "This channel already have this service",
                });
              }
              res.json({ status: "ERROR", msg: error });
            });
          }
          const scheduleValues = scheduleRows.map((s) => [
            channel_id,
            s.day_of_week,
            s.start_time,
            s.end_time,
          ]);

          const doCommit = () => {
            connection.commit(function (error) {
              if (error) {
                return connection.rollback(() => {
                  connection.release();
                  res.json({ status: "ERROR", msg: error });
                });
              }
              connection.release();
              return res.json({
                status: "SUCCESS",
                msg: "Successfully Added",
              });
            });
          };

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
              doCommit();
            },
          );
        },
      );
    });
  });
};

const DeleteChannelMatching = (req, res, next) => {
  const { channel_id, service_car_size_id } = req.body;

  if (!channel_id || !service_car_size_id) {
    return res.json({
      status: "ERROR",
      msg: "channel_id and service_car_size_id are required",
    });
  }

  Conn.execute(
    "DELETE FROM channel_service WHERE channel_id = ? AND service_car_size_id = ?",
    [channel_id, service_car_size_id],
    function (error, result) {
      if (error) {
        return res.json({ status: "ERROR", msg: error });
      }
      if (result.affectedRows === 0) {
        return res.json({
          status: "WARNING",
          msg: "Record not found or already deleted",
        });
      }
      return res.json({
        status: "SUCCESS",
        msg: "Successfully Deleted",
      });
    }
  );
};

const PutUpdateChannelMatching = (req, res, next) => {
  const { old_channel_id, channel_id, service_ids, schedule } = req.body;

  if (!old_channel_id) {
    return res.json({
      status: "ERROR",
      msg: "old_channel_id is required",
    });
  }

  if (!Array.isArray(service_ids) || service_ids.length === 0) {
    return res.json({
      status: "ERROR",
      msg: "At least one service is required",
    });
  }

  if (!channel_id) {
    return res.json({
      status: "ERROR",
      msg: "channel_id is required",
    });
  }

  const scheduleRows =
    typeof schedule === "object" && schedule !== null
      ? Object.entries(schedule)
          .map(([day_of_week, times]) => ({ day_of_week, ...times }))
          .filter((s) => s.start_time && s.end_time)
      : [];

  if (scheduleRows.length === 0) {
    return res.json({
      status: "ERROR",
      msg: "At least one day time input is required",
    });
  }

  Conn.getConnection(function (err, connection) {
    if (err) {
      return res.json({ status: "ERROR", msg: err });
    }
    connection.beginTransaction(function (error) {
      if (error) {
        connection.release();
        return res.json({ status: "ERROR", msg: error });
      }

      connection.query(
        "DELETE FROM channel_service WHERE channel_id = ?",
        [old_channel_id],
        function (error) {
          if (error) {
            return connection.rollback(() => {
              connection.release();
              res.json({ status: "ERROR", msg: error });
            });
          }

          const serviceValues = service_ids.map((id) => [channel_id, id]);
          connection.query(
            "INSERT INTO channel_service (channel_id, service_car_size_id) VALUES ?",
            [serviceValues],
            function (error) {
              if (error) {
                return connection.rollback(() => {
                  connection.release();
                  return res.json(
                    error.code === "ER_DUP_ENTRY"
                      ? {
                          status: "WARNING",
                          msg: "This channel already has this service",
                        }
                      : { status: "ERROR", msg: error }
                  );
                });
              }

              connection.query(
                "DELETE FROM channel_schedule WHERE channel_id = ?",
                [channel_id],
                function (error) {
                  if (error) {
                    return connection.rollback(() => {
                      connection.release();
                      res.json({ status: "ERROR", msg: error });
                    });
                  }

                  const scheduleValues = scheduleRows.map((s) => [
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
                        return res.json({
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
    });
  });
};

const PutUpdateChannelMatchingAvailable = (req, res, next) => {
  const { channel_id, service_car_size_id, is_available } = req.body;

  if (!channel_id || !service_car_size_id) {
    return res.json({
      status: "ERROR",
      msg: "channel_id and service_car_size_id are required",
    });
  }

  const newAvailable = is_available === 1 || is_available === true ? 1 : 0;

  Conn.execute(
    "UPDATE channel_service SET is_available = ? WHERE channel_id = ? AND service_car_size_id = ?",
    [newAvailable, channel_id, service_car_size_id],
    function (error, result) {
      if (error) {
        return res.json({ status: "ERROR", msg: error });
      }
      if (result.affectedRows === 0) {
        return res.json({
          status: "WARNING",
          msg: "Record not found",
        });
      }
      return res.json({
        status: "SUCCESS",
        msg: "Successfully Updated",
      });
    }
  );
};

module.exports = {
  GetAllChannelMatching,
  PostAddChannelMatching,
  DeleteChannelMatching,
  PutUpdateChannelMatching,
  PutUpdateChannelMatchingAvailable,
};
