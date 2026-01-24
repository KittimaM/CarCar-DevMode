var jwt = require("jsonwebtoken");
const Conn = require("../../../db");
const secret = process.env.SECRET_WORD;

const getRolePermissionByToken = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, secret);
    const { role_id } = decoded;
    Conn.execute(
      "SELECT * FROM role_permission WHERE role_id = ?",
      [role_id],
      function (error, result) {
        if (error) {
          return res.json({ status: "ERROR", msg: error });
        } else if (result[0].length == 0) {
          return res.json({ status: "NO DATA", msg: "NO DATA" });
        } else {
          return res.json({ status: "SUCCESS", msg: result });
        }
      },
    );
  } catch (err) {
    return res.json({ status: "ERROR", msg: "token expired" });
  }
};

const getRolePermissionById = (req, res, next) => {
  const { role_id } = req.body;
  Conn.execute(
    "SELECT * FROM role_permission WHERE role_id = ?",
    [role_id],
    function (error, result) {
      if (error) {
        return res.json({ status: "ERROR", msg: error });
      } else if (result.length == 0) {
        return res.json({ status: "NO DATA", msg: "NO DATA" });
      } else {
        return res.json({ status: "SUCCESS", msg: result });
      }
    },
  );
};

module.exports = {
  getRolePermissionByToken,
  getRolePermissionById,
};
