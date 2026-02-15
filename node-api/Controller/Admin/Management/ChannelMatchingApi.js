const Conn = require("../../../db");

const GetAllChannelMatching = (req, res, next) => {
  Conn.execute(
    `
    SELECT 
        cs.channel_id,
        cs.service_id,
        cs.is_available,
        channel.name AS channel_name,
        branch.name AS branch_name,
        service.name AS service_name
    FROM
        channel
            JOIN
        channel_service cs ON cs.channel_id = channel.id
            JOIN
        service ON service.id = cs.service_id
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

module.exports = {
  GetAllChannelMatching,
};
