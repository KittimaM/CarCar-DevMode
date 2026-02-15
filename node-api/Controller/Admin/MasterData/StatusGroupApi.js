const Conn = require("../../../db");

const GetAllStatusGroup = (req, res, next) => {
  Conn.execute("SELECT * FROM status_group", function (error, results) {
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

const PostAddStatusGroup = (req, res, next) => {
  const { code } = req.body;
  Conn.execute(
    "INSERT INTO status_group (code) VALUES (?)",
    [code],
    function (error) {
      if (error) {
        if (error.code === "ER_DUP_ENTRY") {
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

const DeleteStatusGroup = (req, res, next) => {
  const { id } = req.body;
  Conn.execute("DELETE FROM status_group WHERE id = ?", [id], function (error) {
    if (error) {
      if (error.code === "ER_ROW_IS_REFERENCED_2") {
        return res.json({ status: "WARNING", msg: "Currently In Use" });
      } else {
        return res.json({ status: "ERROR", msg: error });
      }
    } else {
      return res.json({ status: "SUCCESS", msg: "Successfully Deleted" });
    }
  });
};

const PutUpdateStatusGroup = (req, res, next) => {
  const { id, code } = req.body;
  Conn.execute(
    "UPDATE status_group SET code = ? WHERE id = ?",
    [code, id],
    function (error) {
      if (error) {
        if (error.code === "ER_DUP_ENTRY") {
          return res.json({ status: "WARNING", msg: "Already In System" });
        } else {
          return res.json({ status: "ERROR", msg: error });
        }
      } else {
        return res.json({ status: "SUCCESS", msg: "Successfully Updated" });
      }
    },
  );
};
module.exports = {
  GetAllStatusGroup,
  PostAddStatusGroup,
  DeleteStatusGroup,
  PutUpdateStatusGroup,
};
