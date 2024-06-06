const Conn = require("../../db");

const AdminCarSize = (req, res, next) => {
  Conn.execute("SELECT * FROM car_size", function (error, results) {
    if (error) {
      res.json({ status: "ERROR", msg: error });
    }
    if (results.length == 0) {
      res.json({ status: "NO DATA", msg: "NO DATA" });
    } else {
      res.json({ status: "SUCCESS", msg: results });
    }
  });
};

const AdminAddCarSize = (req, res, next) => {
  const { size, description, is_available } = req.body;
  Conn.execute(
    `INSERT INTO car_size(size, description, is_available) VALUES(?,?,?)`,
    [size, description, is_available],
    function (error, result) {
      if (error) {
        res.json({ status: "ERROR", msg: error });
      } else {
        const insertId = result.insertId;
        res.json({ status: "SUCCESS", msg: insertId });
      }
    }
  );
};

const AdminDeleteCarSize = (req, res, next) => {
  const { id } = req.body;
  Conn.execute(
    "DELETE FROM car_size WHERE id = ?",
    [id],
    function (error, result) {
      if (error) {
        res.json({ status: "ERROR", msg: error });
      } else {
        res.json({ status: "SUCCESS", msg: "SUCCESS" });
      }
    }
  );
};

const AdminUpdateCarSize = (req, res, next) => {
  const { id, size, description, is_available } = req.body;
  Conn.execute(
    `UPDATE car_size SET size = ? , description = ?, is_available = ? WHERE id = ?`,
    [size, description, is_available, id],
    function (error, result) {
      if (error) {
        res.json({ status: "ERROR", msg: error });
      } else {
        res.json({ status: "SUCCESS", msg: "SUCCESS" });
      }
    }
  );
};

module.exports = {
  AdminCarSize,
  AdminAddCarSize,
  AdminDeleteCarSize,
  AdminUpdateCarSize,
};
