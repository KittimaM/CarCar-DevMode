var bcrypt = require("bcrypt");
var crypto = require("crypto");
const Conn = require("../../db");
const saltRounds = 10;
const RESET_EXPIRY_MINUTES = 60;

// Optional: set in .env for sending emails (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, RESET_EMAIL_FROM)
let transporter = null;
try {
  const nodemailer = require("nodemailer");
  if (
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS
  ) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587", 10),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
} catch (e) {
  // nodemailer not installed or config missing
}

const sendResetEmail = (email, resetLink) => {
  if (!transporter) {
    console.log("[Password reset] No SMTP configured. Reset link:", resetLink);
    return Promise.resolve();
  }
  const from = process.env.RESET_EMAIL_FROM || process.env.SMTP_USER;
  return transporter.sendMail({
    from,
    to: email,
    subject: "Reset your password",
    text: `Use this link to reset your password (valid ${RESET_EXPIRY_MINUTES} minutes):\n${resetLink}`,
    html: `<p>Use this link to reset your password (valid ${RESET_EXPIRY_MINUTES} minutes):</p><p><a href="${resetLink}">${resetLink}</a></p>`,
  });
};

const ForgotPassword = (req, res) => {
  const { email } = req.body;
  if (!email || String(email).trim() === "") {
    return res.json({ status: "ERROR", msg: "Email is required" });
  }
  const emailTrim = email.trim();

  Conn.execute(
    "SELECT id, name FROM customer_user WHERE email = ?",
    [emailTrim],
    (err, rows) => {
      if (err) return res.json({ status: "ERROR", msg: err.message });
      // Always return same message so we don't reveal if email exists
      const successMsg = "If that email is registered, we sent a reset link.";

      if (rows.length === 0) {
        return res.json({ status: "SUCCESS", msg: successMsg });
      }

      const userId = rows[0].id;
      const token = crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + RESET_EXPIRY_MINUTES * 60 * 1000);

      Conn.execute(
        "INSERT INTO customer_password_reset (customer_user_id, token, expires_at) VALUES (?, ?, ?)",
        [userId, token, expiresAt],
        (insertErr) => {
          if (insertErr) return res.json({ status: "ERROR", msg: insertErr.message });

          const baseUrl = process.env.RESET_BASE_URL || "http://localhost:3001";
          const resetLink = `${baseUrl}/customer/reset-password?token=${token}`;

          sendResetEmail(emailTrim, resetLink)
            .then(() => res.json({ status: "SUCCESS", msg: successMsg }))
            .catch((mailErr) => {
              console.error("Send reset email failed:", mailErr);
              res.json({ status: "SUCCESS", msg: successMsg });
            });
        }
      );
    }
  );
};

const ResetPassword = (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword || String(newPassword).trim().length < 6) {
    return res.json({
      status: "ERROR",
      msg: "Valid token and password (at least 6 characters) are required",
    });
  }

  Conn.execute(
    "SELECT id, customer_user_id FROM customer_password_reset WHERE token = ? AND expires_at > NOW()",
    [token],
    (err, rows) => {
      if (err) return res.json({ status: "ERROR", msg: err.message });
      if (rows.length === 0) {
        return res.json({ status: "ERROR", msg: "Invalid or expired reset link" });
      }

      const { id: resetId, customer_user_id } = rows[0];
      bcrypt.hash(newPassword.trim(), saltRounds, (hashErr, hash) => {
        if (hashErr) return res.json({ status: "ERROR", msg: hashErr.message });
        Conn.execute(
          "UPDATE customer_user SET password = ? WHERE id = ?",
          [hash, customer_user_id],
          (updateErr) => {
            if (updateErr) return res.json({ status: "ERROR", msg: updateErr.message });
            Conn.execute("DELETE FROM customer_password_reset WHERE id = ?", [resetId], () => {
              return res.json({ status: "SUCCESS", msg: "Password updated. You can log in now." });
            });
          }
        );
      });
    }
  );
};

module.exports = {
  ForgotPassword,
  ResetPassword,
};
