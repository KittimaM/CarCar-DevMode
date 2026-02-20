const Conn = require("../../../db");

const GetAllChannel = (req, res, next) => {
  Conn.execute(
    "SELECT channel.*, branch.name AS branch_name FROM channel JOIN branch ON channel.branch_id = branch.id",
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

const PostAddChannel = (req, res, next) => {
  const { name, max_capacity, branch_id } = req.body;
  Conn.execute(
    "INSERT INTO channel (name, max_capacity, branch_id) VALUES (?, ?, ?)",
    [name, max_capacity, branch_id],
    function (error) {
      if (error) {
        if (error.code === "ER_DUP_ENTRY") {
          return res.json({
            status: "WARNING",
            msg: "This Branch Already Has A Channel With This Name",
          });
        } else {
          return res.json({ status: "ERROR", msg: error });
        }
      }
      return res.json({ status: "SUCCESS", msg: "Successfully Added" });
    },
  );
};

const DeleteChannel = (req, res, next) => {
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
                        res.json({
                          status: "WARNING",
                          msg: "Currently In Use",
                        });
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
        },
      );
    });
  });
};

const PutUpdateChannel = (req, res, next) => {
  const { id, name, max_capacity, branch_id } = req.body;
  Conn.execute(
    "UPDATE channel SET name = ?, max_capacity = ?, branch_id = ? WHERE id = ?",
    [name, max_capacity, branch_id, id],
    function (error) {
      if (error) {
        if (error.code === "ER_DUP_ENTRY") {
          return res.json({
            status: "WARNING",
            msg: "This Branch Already Has A Channel With This Name",
          });
        } else {
          return res.json({ status: "ERROR", msg: error });
        }
      }
      return res.json({ status: "SUCCESS", msg: "Successfully Updated" });
    },
  );
};

module.exports = {
  GetAllChannel,
  PostAddChannel,
  DeleteChannel,
  PutUpdateChannel,
};
