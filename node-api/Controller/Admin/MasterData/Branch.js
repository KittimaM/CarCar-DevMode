const Conn = require("../../../db");

const GetAllBranch = (req, res, next) => {
  Conn.execute(
    "SELECT * FROM branch",
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

const AddBranch = (req, res, next) => {
  const {
    name, address, phone
  } = req.body;
  Conn.execute(
    `INSERT INTO branch (name, address, phone) VALUES (?,?,?)`,
    [name, address, phone],
    function (error) {
      if (error) {
          return res.json({ status: "ERROR", msg: error });
      } else {
        return res.json({ status: "SUCCESS", msg: "Successfully Added" });
      }
    }
  );
};  

const DeleteBranch = (req, res, next) => {
  const { id } = req.body;
  Conn.execute("DELETE FROM branch WHERE id = ?", [id], function (error) {
    if (error) {
      if (error.code === "ER_ROW_IS_REFERENCED_2") {
        return res.json({
          status: "WARNING",
          msg: "Currently In Use",
        });
      } else {
        return res.json({ status: "ERROR", msg: error });
      }
    } else {
      return res.json({ status: "SUCCESS", msg: "Successfully Deleted" });
    }
  });
};

const UpdateBranchAvailable = (req, res, next) => {
  const { id, is_available } = req.body;
  Conn.execute("UPDATE branch SET is_available = ? WHERE id = ?", [is_available, id], function (error) {
    if (error) {
      return res.json({ status: "ERROR", msg: error });
    }
    return res.json({ status: "SUCCESS", msg: "Successfully Updated" });
  });
};

const UpdateBranch = (req, res, next) => {
  const { id, name, address, phone } = req.body;
  Conn.execute("UPDATE branch SET name = ?, address = ?, phone = ? WHERE id = ?", [name, address, phone, id], function (error) {
    if (error) {
      return res.json({ status: "ERROR", msg: error });
    }
    return res.json({ status: "SUCCESS", msg: "Successfully Updated" });
  });
};

const GetAvailableBranch = (req, res, next) => {
  Conn.execute("SELECT * FROM branch WHERE is_available = 1", function (error, results) {
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
  GetAllBranch,
  AddBranch,
  DeleteBranch,
  UpdateBranchAvailable,
  UpdateBranch,
  GetAvailableBranch
};
