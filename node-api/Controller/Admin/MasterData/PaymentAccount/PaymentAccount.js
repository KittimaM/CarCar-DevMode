const path = require("path");
const fs = require("fs");
const Conn = require("../../../../db");

const UPLOAD_DIR = path.resolve(__dirname, "..", "..", "..", "uploads", "payment-qr");

const GetAllPaymentAccount = (req, res, next) => {
  Conn.execute(
    "SELECT payment_account.* , payment_type.name AS type FROM payment_account JOIN payment_type ON payment_type.id = payment_account.payment_type_id",
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

const PostAddPaymentAccount = (req, res, next) => {
  const { payment_type_id, provider, account_no, account_name } = req.body;
  const qrCodePath = req.file ? `uploads/payment-qr/${req.file.filename}` : "";

  Conn.execute(
    "INSERT INTO payment_account (payment_type_id, provider, account_no, account_name, qr_code) VALUES (?, ?, ?, ?, ?)",
    [payment_type_id, provider, account_no, account_name, qrCodePath],
    function (error, result) {
      if (error) {
        return res.json({ status: "ERROR", msg: error });
      }
      return res.json({ status: "SUCCESS", msg: "Successfully Added" });
    },
  );
};

const PutUpdatePaymentAccount = (req, res, next) => {
  const { id, payment_type_id, provider, account_no, account_name, existing_qr_code } = req.body;
  const qrCodePath = req.file
    ? `uploads/payment-qr/${req.file.filename}`
    : (existing_qr_code && typeof existing_qr_code === "string" ? existing_qr_code : "");

  Conn.execute(
    "UPDATE payment_account SET payment_type_id = ?, provider = ?, account_no = ?, account_name = ?, qr_code = ? WHERE id = ?",
    [payment_type_id, provider, account_no, account_name, qrCodePath, id],
    function (error, result) {
      if (error) {
        return res.json({ status: "ERROR", msg: error });
      }
      return res.json({
        status: "SUCCESS",
        msg: "Successfully Updated",
        qr_code: qrCodePath,
      });
    },
  );
};

const UpdatePaymentAccountAvailable = (req, res, next) => {
  const { id, is_available } = req.body;
  Conn.execute(
    "UPDATE payment_account SET is_available = ? WHERE id = ?",
    [is_available, id],
    function (error) {
      if (error) {
        return res.json({ status: "ERROR", msg: error });
      }
      return res.json({ status: "SUCCESS", msg: "Successfully Updated" });
    },
  );
};

const DeletePaymentAccount = (req, res, next) => {
  const { id } = req.body;
  if (!id) {
    return res.json({ status: "ERROR", msg: "id is required" });
  }
  Conn.beginTransaction(function (error) {
    if (error) {
      return res.json({ status: "ERROR", msg: error });
    }
    Conn.execute(
      "SELECT * FROM payment_account WHERE id = ?",
      [id],
      function (error, rows) {
        if (error) {
          return Conn.rollback(() => {
            res.json({ status: "ERROR", msg: error });
          });
        }
        if (!rows || rows.length === 0) {
          return Conn.rollback(() => {
            res.json({ status: "ERROR", msg: "Record not found" });
          });
        }
        const row = rows[0];

        Conn.execute(
          "DELETE FROM payment_account WHERE id = ?",
          [id],
          function (err, result) {
            if (err) {
              return Conn.rollback(() => {
                res.json({ status: "ERROR", msg: err });
              });
            }
            if (result.affectedRows === 0) {
              return Conn.rollback(() => {
                res.json({ status: "ERROR", msg: "Record not found" });
              });
            }
            Conn.commit(function (commitErr) {
              if (commitErr) {
                return Conn.rollback(() => {
                  res.json({ status: "ERROR", msg: commitErr });
                });
              }

              const hasQrFile =
                row.qr_code && typeof row.qr_code === "string";
              if (!hasQrFile) {
                return res.json({
                  status: "SUCCESS",
                  msg: "Successfully Deleted",
                });
              }

              const filePath = path.join(
                UPLOAD_DIR,
                path.basename(row.qr_code)
              );
              fs.unlink(filePath, (unlinkErr) => {
                if (unlinkErr && unlinkErr.code !== "ENOENT") {
                  Conn.execute(
                    "INSERT INTO payment_account (id, payment_type_id, provider, account_no, account_name, qr_code, is_available) VALUES (?, ?, ?, ?, ?, ?, ?)",
                    [
                      row.id,
                      row.payment_type_id,
                      row.provider,
                      row.account_no,
                      row.account_name,
                      row.qr_code,
                      row.is_available != null ? row.is_available : 1,
                    ],
                    function (insertErr) {
                      if (insertErr) {
                        return res.json({
                          status: "ERROR",
                          msg: "Delete failed and could not restore record.",
                        });
                      }
                      return res.json({
                        status: "ERROR",
                        msg: "Failed to remove QR file. Record restored.",
                      });
                    }
                  );
                  return;
                }
                res.json({
                  status: "SUCCESS",
                  msg: "Successfully Deleted",
                });
              });
            });
          }
        );
      }
    );
  });
};

module.exports = {
  GetAllPaymentAccount,
  PostAddPaymentAccount,
  PutUpdatePaymentAccount,
  UpdatePaymentAccountAvailable,
  DeletePaymentAccount,
};
