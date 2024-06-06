var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const Conn = require("../../db");
const secret = process.env.SECRET_WORD;

const AdminGetAllOnLeave = (req, res, next) => {
  Conn.execute("SELECT * FROM on_leave", function (error, results) {
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

const AdminAddOnLeave = (req, res, next) => {
  const { staff_id, start_date, end_date, on_leave_type_id, reason } = req.body;
  Conn.execute(
    "INSERT INTO on_leave(staff_id, start_date, end_date, on_leave_type_id, reason) VALUES (?,?,?,?,?)",
    [staff_id, start_date, end_date, on_leave_type_id, reason],
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

const AdminDeleteOnLeave = (req, res, next) => {
  const { id } = req.body;
  Conn.execute(
    "DELETE FROM on_leave WHERE id = ?",
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

const AdminUpdateOnLeave = (req, res, next) => {
  const { id, staff_id, start_date, end_date, reason, on_leave_type_id } =
    req.body;
  Conn.execute(
    "UPDATE on_leave SET staff_id = ?, start_date = ?, end_date = ?, reason = ?, on_leave_type_id = ? WHERE id = ?",
    [staff_id, start_date, end_date, reason, on_leave_type_id, id],
    function (error, result) {
      if (error) {
        res.json({ status: "ERROR", msg: error });
      } else {
        res.json({ status: "SUCCESS", msg: "SUCCESS" });
      }
    }
  );
};

const AdminApproveOnLeave = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, secret);
    const staff_id = decoded.id;
    const { id, on_leave_type_id } = req.body;
    Conn.execute(
      "UPDATE on_leave SET is_approved = 1, approved_by_id = ? WHERE id = ?",
      [staff_id, id],
      function (on_leave_error, result) {
        if (on_leave_error) {
          res.json({ status: "ERROR", msg: on_leave_error });
        } else {
          let updateColumn;
          switch (on_leave_type_id) {
            case "1":
              updateColumn = "sick_leave_count";
              break;
            case "2":
              updateColumn = "privacy_leave_count";
              break;
            case "3":
              updateColumn = "birth_day_leave_count";
              break;
          }
          Conn.execute(
            `UPDATE on_leave_followup SET ${updateColumn} = ${updateColumn} + 1 WHERE staff_id = ${staff_id}`,
            function (error, result) {
              if (error) {
                res.json({ status: "ERROR", msg: error });
              } else {
                res.json({ status: "SUCCESS", msg: "SUCCESS" });
              }
            }
          );
        }
      }
    );
  } catch (err) {
    res.json({ status: "ERROR", msg: "token expired" });
  }
};

const AdminGetOnLeavePersonal = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, secret);
    const staff_id = decoded.id;
    Conn.execute(
      "SELECT * FROM on_leave WHERE staff_id = ?",
      [staff_id],
      function (error, results) {
        if (error) {
          res.json({ status: "ERROR", msg: error });
        }
        if (results.length == 0) {
          res.json({ status: "NO DATA", msg: "NO DATA" });
        } else {
          res.json({ status: "SUCCESS", msg: results });
        }
      }
    );
  } catch (err) {
    res.json({ status: "ERROR", msg: "token expired" });
  }
};

const AdminAddOnLeavePersonal = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, secret);
    const staff_id = decoded.id;
    const { start_date, end_date, reason, on_leave_type_id } = req.body;
    Conn.execute(
      "INSERT INTO on_leave(staff_id, start_date, end_date, reason, on_leave_type_id) VALUES (?,?,?,?,?)",
      [staff_id, start_date, end_date, reason, on_leave_type_id],
      function (error, result) {
        if (error) {
          res.json({ status: "ERROR", msg: error });
        } else {
          const insertId = result.insertId;
          res.json({ status: "SUCCESS", msg: insertId });
        }
      }
    );
  } catch (err) {
    res.json({ status: "ERROR", msg: "token expired" });
  }
};

module.exports = {
  AdminGetAllOnLeave,
  AdminAddOnLeave,
  AdminDeleteOnLeave,
  AdminUpdateOnLeave,
  AdminApproveOnLeave,
  AdminGetOnLeavePersonal,
  AdminAddOnLeavePersonal,
};
