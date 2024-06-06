const Conn = require("../../db");

const AdminGetAllProvince = (req, res, next) => {
  Conn.execute("SELECT * FROM province", function (error, results) {
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



module.exports = {
  AdminGetAllProvince,
};
