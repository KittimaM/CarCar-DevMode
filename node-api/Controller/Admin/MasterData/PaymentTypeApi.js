const Conn = require("../../../db");

const GetAllPaymentType = (req, res, next) => {
  Conn.execute("SELECT * FROM payment_type", function (error, results) {
    if (error) {
      return res.json({ status: "ERROR", msg: error });
    }
    if (results.length === 0) {
      return res.json({ status: "NO DATA", msg: "NO DATA" });
    } else {
      return res.json({ status: "SUCCESS", msg: results });
    }
  });
};

const PostAddPaymentType = (req, res, next) => {
  const { type, is_available } = req.body;
  Conn.execute(
    "INSERT INTO payment_type(type, is_available) VALUES (?,?)",
    [type, is_available],
    function (error, result) {
      if (error) {
        return res.json({ status: "ERROR", msg: error });
      } else {
        const insertId = result.insertId;
        return res.json({ status: "SUCCESS", msg: insertId });
      }
    },
  );
};

const PutUpdatePaymentType = (req, res, next) => {
  const { id, type, is_available } = req.body;
  Conn.execute(
    "UPDATE payment_type SET type = ?, is_available = ? WHERE id = ?",
    [type, is_available, id],
    function (error, result) {
      if (error) {
        return res.json({ status: "ERROR", msg: error });
      } else {
        return res.json({ status: "SUCCESS", msg: "SUCCESS" });
      }
    },
  );
};

const DeletePaymentType = (req, res, next) => {
  const { id } = req.body;
  Conn.execute(
    "DELETE FROM payment_type WHERE id = ?",
    [id],
    function (error, result) {
      if (error) {
        return res.json({ status: "ERROR", msg: error });
      } else {
        return res.json({ status: "SUCCESS", msg: "SUCCESS" });
      }
    },
  );
};

module.exports = {
  PostAddPaymentType,
  GetAllPaymentType,
  PutUpdatePaymentType,
  DeletePaymentType,
};
