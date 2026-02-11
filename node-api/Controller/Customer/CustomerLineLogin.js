const axios = require("axios");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Conn = require("../../db");
const secret = process.env.SECRET_WORD;
const saltRounds = 10;

const LINE_AUTH_URL = "https://access.line.me/oauth2/v2.1/authorize";
const LINE_TOKEN_URL = "https://api.line.me/oauth2/v2.1/token";
const LINE_PROFILE_URL = "https://api.line.me/v2/profile";
const LINE_LOGIN_PHONE_PREFIX = "LINE_";

/**
 * Redirect user to LINE authorization page.
 * GET /customer/line-auth
 */
const lineAuthRedirect = (req, res) => {
  const channelId = process.env.LINE_CHANNEL_ID;
  const callbackUri = process.env.LINE_CALLBACK_URL; // e.g. https://your-api.com/customer/line-callback
  const customerWebUrl = process.env.CUSTOMER_WEB_URL || "http://localhost:3001";
  if (!channelId || !callbackUri) {
    return res.redirect(`${customerWebUrl}/?error=LINE_LOGIN_NOT_CONFIGURED`);
  }
  const state = Math.random().toString(36).slice(2) + Date.now();
  const params = new URLSearchParams({
    response_type: "code",
    client_id: channelId,
    redirect_uri: callbackUri,
    state,
    scope: "profile openid",
  });
  res.redirect(`${LINE_AUTH_URL}?${params.toString()}`);
};

/**
 * LINE callback: exchange code for token, get profile, find or create customer, issue JWT, redirect to customer web.
 * GET /customer/line-callback?code=...&state=...
 */
const lineCallback = async (req, res) => {
  const customerWebUrl = process.env.CUSTOMER_WEB_URL || "http://localhost:3001";
  const { code, error, error_description } = req.query;
  if (error) {
    return res.redirect(`${customerWebUrl}/?error=${encodeURIComponent(error_description || error)}`);
  }
  if (!code) {
    return res.redirect(`${customerWebUrl}/?error=no_code`);
  }
  const channelId = process.env.LINE_CHANNEL_ID;
  const channelSecret = process.env.LINE_CHANNEL_SECRET;
  const callbackUri = process.env.LINE_CALLBACK_URL;
  if (!channelId || !channelSecret || !callbackUri) {
    return res.redirect(`${customerWebUrl}/?error=LINE_LOGIN_NOT_CONFIGURED`);
  }
  try {
    const tokenRes = await axios.post(
      LINE_TOKEN_URL,
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: callbackUri,
        client_id: channelId,
        client_secret: channelSecret,
      }).toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    const accessToken = tokenRes.data.access_token;
    const profileRes = await axios.get(LINE_PROFILE_URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const { userId: lineUserId, displayName } = profileRes.data;
    const phone = LINE_LOGIN_PHONE_PREFIX + lineUserId;
    const name = displayName || "LINE User";

    Conn.execute(
      "SELECT id, name FROM customer_user WHERE phone = ?",
      [phone],
      function (err, rows) {
        if (err) {
          return res.redirect(`${customerWebUrl}/?error=${encodeURIComponent(err.message)}`);
        }
        const customer_user_login_mins_limit = 60; // default; can load from general_setting
        const createToken = (id, phone, name) =>
          jwt.sign({ id, phone, name }, secret, {
            expiresIn: `${customer_user_login_mins_limit}m`,
          });

        if (rows && rows.length > 0) {
          const { id } = rows[0];
          // Update line_user_id if column exists (for LINE notifications)
          Conn.execute(
            "UPDATE customer_user SET line_user_id = ? WHERE id = ?",
            [lineUserId, id],
            function () { /* ignore err if column missing */ }
          );
          const token = createToken(id, phone, name);
          return res.redirect(`${customerWebUrl}/?token=${encodeURIComponent(token)}`);
        }
        const randomPassword = Math.random().toString(36) + Date.now();
        bcrypt.hash(randomPassword, saltRounds, function (hashErr, hash) {
          if (hashErr) {
            return res.redirect(`${customerWebUrl}/?error=${encodeURIComponent(hashErr.message)}`);
          }
          Conn.execute(
            "INSERT INTO customer_user (phone, name, password, line_user_id) VALUES (?, ?, ?, ?)",
            [phone, name, hash, lineUserId],
            function (insertErr, result) {
              if (insertErr) {
                Conn.execute(
                  "INSERT INTO customer_user (phone, name, password) VALUES (?, ?, ?)",
                  [phone, name, hash],
                  function (insertErr2, result2) {
                    if (insertErr2) {
                      return res.redirect(`${customerWebUrl}/?error=${encodeURIComponent(insertErr2.message)}`);
                    }
                    const id = result2.insertId;
                    const token = createToken(id, phone, name);
                    return res.redirect(`${customerWebUrl}/?token=${encodeURIComponent(token)}`);
                  }
                );
                return;
              }
              const id = result.insertId;
              const token = createToken(id, phone, name);
              return res.redirect(`${customerWebUrl}/?token=${encodeURIComponent(token)}`);
            }
          );
        });
      }
    );
  } catch (err) {
    const msg = err.response?.data?.error_description || err.message || "LINE_LOGIN_FAILED";
    return res.redirect(`${customerWebUrl}/?error=${encodeURIComponent(msg)}`);
  }
};

module.exports = {
  lineAuthRedirect,
  lineCallback,
};
