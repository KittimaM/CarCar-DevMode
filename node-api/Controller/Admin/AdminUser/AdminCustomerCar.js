const Conn = require("../../../db");

const AdminGetAllCustomerCar = (req, res, next) => {
  Conn.execute(
    `SELECT 
      cc.id AS car_id,
      cu.id AS customer_id,
      cu.phone,
      cu.name,
      cc.plate_no,
      p.province,
      cc.brand,
      cc.color,
      cc.model,
      cc.size_id,
      cz.size
      FROM customer_car cc 
      JOIN customer_user cu ON cu.id = cc.customer_id 
      JOIN car_size cz on cz.id = cc.size_id
      JOIN province p ON p.id = cc.province_id`,
    function (error, results) {
      if (error) {
        return res.json({ status: "ERROR", msg: error });
      }
      if (results.length === 0) {
        return res.json({ status: "NO DATA", msg: "NO DATA" });
      } else {
        return res.json({ status: "SUCCESS", msg: results });
      }
    }
  );
};

const AdminAddCustomerCar = (req, res, next) => {
  const { plate_no, province_id, brand, model, color, size_id, customer_id } =
    req.body;
  Conn.execute(
    `INSERT INTO customer_car (plate_no, province_id, brand, model, color, size_id, customer_id) VALUES (?,?,?,?,?,?,?)`,
    [plate_no, province_id, brand, model, color, size_id, customer_id],
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
    }
  );
};

const AdminUpdateCustomerCar = (req, res, next) => {
  const { id, plate_no, province, brand, model, color, size_id, customer_id } =
    req.body;
  Conn.execute(
    `UPDATE customer_car SET plate_no = ? , province = ?, brand = ?, model = ?, color = ?, size_id = ?, customer_id = ? WHERE id = ?`,
    [plate_no, province, brand, model, color, size_id, customer_id, id],
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
    }
  );
};

const AdminDeleteCustomerCar = (req, res, next) => {
  const { id } = req.body;
  Conn.execute("DELETE FROM customer_car WHERE id = ?", [id], function (error) {
    if (error) {
      return res.json({ status: "ERROR", msg: error });
    } else {
      return res.json({ status: "SUCCESS", msg: "Successfully Deleted" });
    }
  });
};

module.exports = {
  AdminGetAllCustomerCar,
  AdminAddCustomerCar,
  AdminUpdateCustomerCar,
  AdminDeleteCustomerCar,
};
