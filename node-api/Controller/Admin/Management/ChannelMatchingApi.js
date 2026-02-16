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
        service.name AS service_name
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
  const serviceIdList = Array.isArray(service_ids) ? service_ids : [];
  const scheduleList = Array.isArray(schedule) ? schedule : [];

  if (serviceIdList.length === 0) {
    return res.json({
      status: "ERROR",
      msg: "At least one service is required",
    });
  }

  const validDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  for (let i = 0; i < scheduleList.length; i++) {
    const s = scheduleList[i];
    if (
      s == null ||
      typeof s !== "object" ||
      (s.day_of_week == null || s.day_of_week === "") ||
      (s.start_time == null || s.start_time === "") ||
      (s.end_time == null || s.end_time === "")
    ) {
      return res.json({
        status: "ERROR",
        msg: `Schedule row ${i + 1}: day_of_week, start_time and end_time are required`,
      });
    }
    if (!validDays.includes(s.day_of_week)) {
      return res.json({
        status: "ERROR",
        msg: `Schedule row ${i + 1}: day_of_week must be one of ${validDays.join(", ")}`,
      });
    }
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
        [serviceIdList.map((id) => [channel_id, id])],
        function (error) {
          if (error) {
            return connection.rollback(() => {
              connection.release();
              res.json({ status: "ERROR", msg: error });
            });
          }
          if (scheduleList.length === 0) {
            connection.commit(function (error) {
              if (error) {
                return connection.rollback(() => {
                  connection.release();
                  res.json({ status: "ERROR", msg: error });
                });
              }
              connection.release();
              return res.json({ status: "SUCCESS", msg: "Successfully Added" });
            });
            return;
          }
          const scheduleRows = scheduleList.map((s) => [
            channel_id,
            s.day_of_week,
            s.start_time,
            s.end_time,
          ]);
          connection.query(
            "INSERT INTO channel_schedule (channel_id, day_of_week, start_time, end_time) VALUES ?",
            [scheduleRows],
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

module.exports = {
  GetAllChannelMatching,
  PostAddChannelMatching,
};
