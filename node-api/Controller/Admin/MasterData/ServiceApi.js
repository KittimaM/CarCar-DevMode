const Conn = require("../../../db");

const GetAllService = (req, res, next) => {
  Conn.execute("SELECT * FROM service", function (error, results) {
    if (error) {
      return res.json({ status: "ERROR", msg: error });
    }
    if (results.length === 0) {
      return res.json({ status: "NO DATA", msg: "No Service Available" });
    }
    return res.json({ status: "SUCCESS", msg: results });
  });
};

const PostAddService = (req, res, next) => {
  const { name } = req.body;
  Conn.execute(
    "INSERT INTO service (name) VALUES (?)",
    [name],
    function (error) {
      if (error) {
        if (error.code === "ER_DUP_ENTRY") {
          return res.json({
            status: "WARNING",
            msg: "This Service Already Exists",
          });
        }
        return res.json({ status: "ERROR", msg: error });
      }
      return res.json({ status: "SUCCESS", msg: "Successfully Added" });
    },
  );
};

const DeleteService = (req, res, next) => {
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
            "DELETE FROM service_car_size WHERE service_id = ?",
            [id],
            function (error) {
              if (error) {
                return connection.rollback(() => {
                  connection.release();
                  res.json({ status: "ERROR", msg: error });
                });
              }
            },
          );
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

const PutUpdateService = (req, res, next) => {
  const { id, name } = req.body;
  Conn.execute(
    "UPDATE service SET name = ? WHERE id = ?",
    [name, id],
    function (error) {
      if (error) {
        if (error.code === "ER_DUP_ENTRY") {
          return res.json({
            status: "WARNING",
            msg: "This Service Already Exists",
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
  GetAllService,
  PostAddService,
  DeleteService,
  PutUpdateService,
};
