var jwt = require("jsonwebtoken");
const Conn = require("../../../db");
const { resolveWalkInChannel } = require("./walkInResolveChannel");
const secret = process.env.SECRET_WORD;

/** บริการที่ช่องนี้รับได้สำหรับ Walk-in ตามขนาดรถ (เทียบ logic กับ customer service-rates + channel_service) */
const PostWalkInServices = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.json({ status: "ERROR", msg: "token expired" });
    }
    jwt.verify(token, secret);
  } catch (err) {
    return res.json({ status: "ERROR", msg: "token expired" });
  }

  const { branch_id, car_size_id } = req.body;
  const brId = parseInt(branch_id, 10);
  const szId = parseInt(car_size_id, 10);
  if (!brId || Number.isNaN(brId) || !szId || Number.isNaN(szId)) {
    return res.json({
      status: "ERROR",
      msg: "branch_id, car_size_id จำเป็นต้องส่งและเป็นตัวเลข",
    });
  }
  Conn.execute(
    `SELECT DISTINCT
        service.id AS service_id,
        service.name AS service_name,
        service_car_size.id AS service_car_size_id,
        service_car_size.duration_minute,
        service_car_size.price
     FROM channel c
     INNER JOIN channel_service cs ON cs.channel_id = c.id AND COALESCE(cs.is_available, 1) = 1
     INNER JOIN service_car_size ON service_car_size.id = cs.service_car_size_id
     INNER JOIN service ON service.id = service_car_size.service_id
     WHERE c.branch_id = ?
       AND service_car_size.car_size_id = ?
       AND (c.booking_mode = 'WALK_IN_ONLY' OR c.booking_mode = 'BOTH')
     ORDER BY service.name ASC, service_car_size.id ASC`,
    [brId, szId],
    function (error, results) {
      if (error) return res.json({ status: "ERROR", msg: error });
      if (!results || results.length === 0) {
        return res.json({ status: "NO DATA", msg: "NO DATA" });
      }
      return res.json({ status: "SUCCESS", msg: results });
    },
  );
};

const AdminBooking = (req, res, next) => {
  Conn.execute("SELECT * FROM booking", function (error, bookingRows) {
    if (error) {
      return res.json({ status: "ERROR", msg: error });
    }
    const bookings = (bookingRows || []).map((r) => ({ ...r, row_source: "booking" }));

    Conn.execute(
      `SELECT w.*, b.name AS branch_name_join, c.name AS channel_name
       FROM walk_in w
       LEFT JOIN branch b ON b.id = w.branch_id
       LEFT JOIN channel c ON c.id = w.channel_id`,
      function (wiErr, walkInRows) {
        if (wiErr) {
          return res.json({ status: "ERROR", msg: wiErr });
        }
        const walkIns = (walkInRows || []).map((row) => ({
          id: row.id,
          row_source: "walk_in",
          start_service_datetime: row.start_service_datetime,
          end_service_datetime: row.end_service_datetime,
          customer_name: row.customer_name,
          customer_phone: row.customer_phone,
          car_no: row.car_no,
          car_size: row.car_size,
          car_color: row.car_color,
          car_size_id: row.car_size_id,
          branch_id: row.branch_id,
          branch_name: row.branch_name || row.branch_name_join,
          service: `[Walk-in · ${row.channel_name || "ช่อง"}] ${row.service_name || ""}`.trim(),
          processing_status: row.processing_status || "pending",
          channel_id: row.channel_id,
          service_car_size_id: row.service_car_size_id,
          service_price: row.service_price,
          service_usetime: row.service_usetime,
          created_at: row.created_at,
        }));

        const merged = [...bookings, ...walkIns];
        if (merged.length === 0) {
          return res.json({ status: "NO DATA", msg: "NO DATA" });
        }
        return res.json({ status: "SUCCESS", msg: merged });
      },
    );
  });
};

const AdminAddBooking = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, secret);
    const { id, username } = decoded;
    const {
      car_no,
      car_size_id,
      car_size,
      customer_name,
      customer_phone,
      service,
      payment_type_id,
      car_color,
      start_service_datetime,
      end_service_datetime,
      service_usetime,
      service_price,
      branch_id,
      branch_name,
      service_car_size_id,
      is_walk_in,
    } = req.body;

    const runInsert = (serviceLabel) => {
      Conn.execute(
        `INSERT INTO booking(car_no, car_size_id, car_size, customer_name, customer_phone, service, payment_type_id, created_by_id, created_by, car_color, start_service_datetime, end_service_datetime, service_usetime, service_price, branch_id, branch_name) 
      VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          car_no,
          car_size_id,
          car_size,
          customer_name,
          customer_phone,
          serviceLabel,
          payment_type_id,
          id,
          username,
          car_color,
          start_service_datetime,
          end_service_datetime,
          service_usetime,
          service_price,
          branch_id || null,
          branch_name || null,
        ],
        function (error, result) {
          if (error) {
            return res.json({ status: "ERROR", msg: error });
          } else {
            const insertId = result.insertId;
            return res.json({ status: "SUCCESS", msg: insertId });
          }
        },
      );
    };

    if (is_walk_in) {
      const scsId = parseInt(service_car_size_id, 10);
      if (!scsId || Number.isNaN(scsId)) {
        return res.json({
          status: "ERROR",
          msg: "Walk-in ต้องระบุ service_car_size_id",
        });
      }
      const brId =
        branch_id != null && branch_id !== ""
          ? parseInt(branch_id, 10)
          : null;
      if (!brId || Number.isNaN(brId)) {
        return res.json({
          status: "ERROR",
          msg: "Walk-in ต้องระบุสาขา",
        });
      }

      const at = start_service_datetime
        ? new Date(String(start_service_datetime).replace(" ", "T"))
        : new Date();
      if (Number.isNaN(at.getTime())) {
        return res.json({
          status: "ERROR",
          msg: "เวลาเริ่มบริการไม่ถูกต้อง",
        });
      }

      resolveWalkInChannel(
        Conn,
        { branchId: brId, serviceCarSizeId: scsId, at },
        function (errMsg, resolved) {
          if (errMsg || !resolved) {
            return res.json({
              status: "ERROR",
              msg: errMsg || "ไม่สามารถจัดช่องได้",
            });
          }
          const chId = resolved.channel_id;
          const walkInParams = [
            brId,
            chId,
            scsId,
            customer_name,
            customer_phone || null,
            car_no,
            parseInt(car_size_id, 10),
            car_size || null,
            car_color || null,
            service || "",
            service_usetime,
            Number(service_price) || 0,
            start_service_datetime,
            end_service_datetime,
            branch_name || null,
            id,
            username,
          ];
          Conn.execute(
            `INSERT INTO walk_in (
              branch_id, channel_id, service_car_size_id,
              customer_name, customer_phone, car_no, car_size_id, car_size, car_color,
              service_name, service_usetime, service_price,
              start_service_datetime, end_service_datetime, branch_name,
              created_by_id, created_by
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            walkInParams,
            function (wiErr, wiRes) {
              if (wiErr) {
                return res.json({ status: "ERROR", msg: wiErr });
              }
              return res.json({
                status: "SUCCESS",
                msg: wiRes.insertId,
              });
            },
          );
        },
      );
      return;
    }

    runInsert(service);
  } catch (err) {
    return res.json({ status: "ERROR", msg: "token expired" });
  }
};

const AdminUpdateStatusBooking = (req, res, next) => {
  const { booking_id, walk_in_id, processing_status } = req.body;
  const wi =
    walk_in_id != null && walk_in_id !== ""
      ? parseInt(walk_in_id, 10)
      : NaN;
  if (!Number.isNaN(wi) && wi > 0) {
    Conn.execute(
      `UPDATE walk_in SET processing_status = ? WHERE id = ?`,
      [processing_status, wi],
      function (error, result) {
        if (error) {
          return res.json({ status: "ERROR", msg: error });
        }
        if (result.affectedRows === 0) {
          return res.json({ status: "WARNING", msg: "Record not found" });
        }
        return res.json({ status: "SUCCESS", msg: "SUCCESS" });
      },
    );
    return;
  }
  const bid =
    booking_id != null && booking_id !== ""
      ? parseInt(booking_id, 10)
      : NaN;
  if (Number.isNaN(bid) || bid <= 0) {
    return res.json({
      status: "ERROR",
      msg: "ต้องส่ง booking_id หรือ walk_in_id",
    });
  }
  Conn.execute(
    `UPDATE booking SET processing_status = ? WHERE id = ?`,
    [processing_status, bid],
    function (error, result) {
      if (error) {
        return res.json({ status: "ERROR", msg: error });
      } else {
        return res.json({ status: "SUCCESS", msg: "SUCCESS" });
      }
    },
  );
};

module.exports = {
  PostWalkInServices,
  AdminBooking,
  AdminAddBooking,
  AdminUpdateStatusBooking,
};
