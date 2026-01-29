const Conn = require("../../db");

const AdminGetAllProvince = (req, res, next) => {
  Conn.execute("SELECT * FROM province", function (error, results) {
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

module.exports = {
  AdminGetAllProvince,
};
