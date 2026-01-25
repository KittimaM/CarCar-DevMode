const Conn = require("../../db");

const AdminCarSize = (req, res, next) => {
  Conn.execute("SELECT * FROM car_size", function (error, results) {
    if (error) {
      return res.json({ status: "ERROR", msg: error });
    }
    if (results.length == 0) {
      return res.json({ status: "NO DATA", msg: "NO DATA" });
    } else {
      return res.json({ status: "SUCCESS", msg: results });
    }
  });
};

const AdminAddCarSize = (req, res, next) => {
  const { size, description } = req.body;
  Conn.execute(
    `INSERT INTO car_size(size, description) VALUES(?,?)`,
    [size, description],
    function (error) {
      if (error) {
        if (error.code == "ER_DUP_ENTRY") {
          return res.json({ status: "WARNING", msg: "Already In System" });
        } else {
          return res.json({ status: "ERROR", msg: error });
        }
      } else {
        return res.json({ status: "SUCCESS", msg: "Successfully Added" });
      }
    },
  );
};

const AdminDeleteCarSize = (req, res, next) => {
  const { id } = req.body;
  Conn.execute("DELETE FROM car_size WHERE id = ?", [id], function (error) {
    if (error) {
      if (error.code == "ER_ROW_IS_REFERENCED_2") {
        return res.json({ status: "WARNING", msg: "Currently In Use" });
      } else {
        return res.json({ status: "ERROR", msg: error });
      }
    } else {
      return res.json({ status: "SUCCESS", msg: "SUCCESS" });
    }
  });
};

const AdminUpdateCarSize = (req, res, next) => {
  const { id, size, description } = req.body;
  Conn.execute(
    `UPDATE car_size SET size = ? , description = ? WHERE id = ?`,
    [size, description, id],
    function (error) {
      if (error) {
        if (error.code == "ER_DUP_ENTRY") {
          return res.json({ status: "WARNING", msg: "Already In System" });
        } else {
          return res.json({ status: "ERROR", msg: error });
        }
      } else {
        return res.json({ status: "SUCCESS", msg: "Successfully Upated" });
      }
    },
  );
};

const UpdateCarSizeAvailable = (req, res, next) => {
  const { id, is_available } = req.body;
  Conn.execute(
    "UPDATE car_size SET is_available = ? WHERE id = ? ",
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

const GetCarSizeById = (req, res, next) => {
  const { id } = req.body;
  Conn.execute(
    "SELECT * FROM car_size WHERE id = ?",
    [id],
    function (error, result) {
      if (error) {
        return res.json({ status: "ERROR", msg: error });
      } else if (result.length == 0) {
        return res.json({ status: "NO DATA", msg: "NO DATA" });
      } else {
        return res.json({ status: "SUCCESS", msg: result[0] });
      }
    },
  );
};

module.exports = {
  AdminCarSize,
  AdminAddCarSize,
  AdminDeleteCarSize,
  AdminUpdateCarSize,
  UpdateCarSizeAvailable,
  GetCarSizeById,
};
