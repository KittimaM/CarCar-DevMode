const Conn = require("../../../db");
const secret = process.env.SECRET_WORD;
var jwt = require("jsonwebtoken");

const AdminGetLatestOnLeaveByType = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, secret);
    const { id } = decoded;
    const on_leave_type_id = req.headers.params;
    Conn.execute(
      "SELECT * FROM on_leave WHERE staff_id = ? AND on_leave_type_id = ? ORDER BY id DESC LIMIT 1",
      [id, on_leave_type_id],
      function (error, result) {
        if (error) {
          return res.json({ status: "ERROR", msg: error });
        } else if (result.length == 0 || result[0].length == 0) {
          return res.json({ status: "NO DATA", msg: "NO DATA" });
        } else {
          return res.json({ status: "SUCCESS", msg: result[0] });
        }
      },
    );
  } catch (err) {
    return res.json({ status: "ERROR", msg: "token expired" });
  }
};

const AdminGetLatestOnLeaveByTypeAndStaffId = (req, res, next) => {
  const { staff_id, on_leave_type_id } = JSON.parse(req.headers.params);
  Conn.execute(
    "SELECT * FROM on_leave WHERE staff_id = ? AND on_leave_type_id = ? ORDER BY id DESC LIMIT 1",
    [staff_id, on_leave_type_id],
    function (error, result) {
      if (error) {
        return res.json({ status: "ERROR", msg: error });
      } else if (result.length == 0 || result[0].length == 0) {
        return res.json({ status: "NO DATA", msg: "NO DATA" });
      } else {
        return res.json({ status: "SUCCESS", msg: result[0] });
      }
    },
  );
};

module.exports = {
  AdminGetLatestOnLeaveByType,
  AdminGetLatestOnLeaveByTypeAndStaffId,
};
