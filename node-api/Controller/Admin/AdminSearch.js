const Conn = require("../../db");

const AdminGetAllSearchFilters = (req, res, next) => {
  Conn.execute("SELECT * FROM search_filter", function (error, results) {
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

const AdminGetSearchResult = (req, res, next) => {
  const { car_id, customer_id } = req.body;
  Conn.execute(
    "SELECT customer_user.name, customer_car.plate_no FROM customer_user LEFT JOIN customer_car ON customer_user.id = customer_car.customer_id WHERE customer_user.id = ? OR customer_car.id = ?",
    [customer_id, car_id],
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

// const AdminAddTemplate = (req, res, next) => {
//   const { name, template, is_available } = req.body;
//   Conn.execute(
//     "INSERT INTO template (name, template, is_available) VALUES (?,?,?)",
//     [name, template, is_available],
//     function (error, result) {
//       if (error) {
//         return res.json({ status: "ERROR", msg: error });
//       } else {
//         const insertId = result.insertId;
//         return res.json({ status: "SUCCESS", msg: insertId });
//       }
//     }
//   );
// };

// const AdminDeleteTemplate = (req, res, next) => {
//   const { id } = req.body;
//   Conn.execute(
//     "DELETE FROM template WHERE id = ?",
//     [id],
//     function (error, result) {
//       if (error) {
//         return res.json({ status: "ERROR", msg: error });
//       } else {
//         return res.json({ status: "SUCCESS", msg: "SUCCESS" });
//       }
//     }
//   );
// };

// const AdminUpdateTemplate = (req, res, next) => {
//   const { id, name, template, is_available } = req.body;
//   Conn.execute(
//     "UPDATE template SET name = ?, template = ?, is_available = ? WHERE id = ?",
//     [name, template, is_available, id],
//     function (error, result) {
//       if (error) {
//         return res.json({ status: "ERROR", msg: error });
//       } else {
//         return res.json({ status: "SUCCESS", msg: "SUCCESS" });
//       }
//     }
//   );
// };

module.exports = {
  AdminGetAllSearchFilters,
  AdminGetSearchResult,
  //   AdminAddTemplate,
  //   AdminDeleteTemplate,
  //   AdminUpdateTemplate,
};
