const Conn = require("../../db");

const AdminGetChannel = (req, res, next) => {
  Conn.execute(
    `SELECT cs.channel_id, cs.service_id, c.name AS channel_name, c.description AS channel_description, c.is_available AS channel_is_available, s.service AS service FROM channel c JOIN channel_service cs ON cs.channel_id = c.id JOIN service s ON cs.service_id = s.id`,
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
  const { name, description, service_ids } = req.body;
  Conn.beginTransaction(function (error) {
    if (error) {
      return res.json({ status: "ERROR", msg: error });
    }
    Conn.execute(
      "INSERT INTO channel (name, description) VALUES (?, ?)",
      [name, description],
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
        const channel_id = result.insertId;
        const values = service_ids.map((service) => [channel_id, service]);

        Conn.query(
          "INSERT INTO channel_service (channel_id, service_id) VALUES ?",
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

const AdminDeleteChannel = (req, res, next) => {
  const { id } = req.body;
  Conn.beginTransaction(function (error) {
    if (error) {
      return res.json({ status: "ERROR", msg: error });
    }
    Conn.execute(
      "DELETE FROM channel_service WHERE channel_id = ?",
      [id],
      function (error) {
        if (error) {
          return Conn.rollback(() => {
            res.json({ status: "ERROR", msg: error });
          });
        }
        Conn.execute(
          "DELETE FROM channel WHERE id = ?",
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

const AdminUpdateChannel = (req, res, next) => {
  const { id, name, description, service_ids } = req.body;
  Conn.beginTransaction(function (error) {
    if (error) {
      return res.json({ status: "ERROR", msg: error });
    }
    Conn.execute(
      "UPDATE channel SET name = ?, description = ? WHERE id = ?",
      [name, description, id],
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
          "DELETE FROM channel_service WHERE channel_id = ?",
          [id],
          function (error) {
            if (error) {
              return Conn.rollback(() => {
                res.json({ status: "ERROR", msg: error });
              });
            }
            const values = service_ids.map((service) => [id, service]);
            Conn.query(
              "INSERT INTO channel_service (channel_id, service_id) VALUES ?",
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
