const SCHEDULE_DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function timeToMin(t) {
  const [h, m] = String(t).split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

function padDate(d) {
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${mo}-${day}`;
}

/**
 * เลือกช่อง Walk-in ให้สอดคล้องกับ logic ลูกค้า (ความจุต่อนาที + นับคิวน้อยก่อน)
 * @param {import("mysql2").Connection} connection — ใช้ Conn (pool) แบบ callback
 * @param {object} p
 * @param {number} p.branchId
 * @param {number} p.serviceCarSizeId
 * @param {Date} p.at
 * @param {(err: string|null, result: { channel_id: number, channel_name: string } | null) => void} done
 */
function resolveWalkInChannel(connection, p, done) {
  const { branchId, serviceCarSizeId, at } = p;
  const dayName = SCHEDULE_DAY_NAMES[at.getDay()];
  const nowMin = at.getHours() * 60 + at.getMinutes();
  const bookingDate = padDate(at);

  connection.execute(
    `SELECT duration_minute, COALESCE(required_staff, 1) AS required_staff
     FROM service_car_size WHERE id = ? LIMIT 1`,
    [serviceCarSizeId],
    (e0, scRows) => {
      if (e0) return done(String(e0.message || e0), null);
      if (!scRows || scRows.length === 0) {
        return done("ไม่พบรายการบริการ (service_car_size)", null);
      }
      const duration = scRows[0].duration_minute || 0;
      const requiredStaff = scRows[0].required_staff || 1;
      if (duration <= 0) {
        return done("ระยะเวลาบริการไม่ถูกต้อง", null);
      }

      connection.execute(
        `SELECT 
           c.id AS channel_id,
           c.name AS channel_name,
           c.max_capacity,
           TIME_FORMAT(cs.start_time, '%H:%i') AS start_time,
           TIME_FORMAT(cs.end_time, '%H:%i') AS end_time
         FROM channel c
         INNER JOIN channel_schedule cs ON cs.channel_id = c.id AND cs.day_of_week = ?
         INNER JOIN channel_service chs ON chs.channel_id = c.id 
           AND chs.service_car_size_id = ? AND COALESCE(chs.is_available, 1) = 1
         WHERE c.branch_id = ?
           AND (c.booking_mode = 'WALK_IN_ONLY' OR c.booking_mode = 'BOTH')`,
        [dayName, serviceCarSizeId, branchId],
        (e1, rawRows) => {
          if (e1) return done(String(e1.message || e1), null);

          const windows = (rawRows || []).filter((row) => {
            const chStart = timeToMin(row.start_time);
            const chEnd = timeToMin(row.end_time);
            if (chEnd <= chStart) {
              return nowMin >= chStart || nowMin < chEnd;
            }
            return nowMin >= chStart && nowMin < chEnd;
          });

          if (windows.length === 0) {
            return done(
              "ไม่มีช่องที่รับบริการนี้ในช่วงเวลาปัจจุบัน (ตารางช่องหรือการผูกบริการ)",
              null,
            );
          }

          const byChannel = new Map();
          for (const w of windows) {
            const chStart = timeToMin(w.start_time);
            const chEnd = timeToMin(w.end_time);
            if (!byChannel.has(w.channel_id)) {
              byChannel.set(w.channel_id, { ...w, chStart, chEnd });
            }
          }
          const channels = Array.from(byChannel.values());
          const channelIds = channels.map((c) => c.channel_id);
          const chPlaceholders = channelIds.map(() => "?").join(",");

          const fetchBookings = (cb) => {
            connection.execute(
              `SELECT 
                 b.channel_id,
                 b.booking_no,
                 TIME_FORMAT(b.start_time, '%H:%i') AS start_time,
                 TIME_FORMAT(b.end_time, '%H:%i') AS end_time,
                 COALESCE(scs.required_staff, 1) AS required_staff
               FROM booking b
               JOIN status st ON st.id = b.status_id
               LEFT JOIN service_car_size scs ON scs.id = b.service_car_size_id
               WHERE b.channel_id IN (${chPlaceholders})
                 AND b.booking_date = ?
                 AND st.code IN ('PENDING', 'CONFIRMED')`,
              [...channelIds, bookingDate],
              (bkErr, bkRows) => {
                if (bkErr) return cb(bkErr, null);
                cb(null, bkRows || []);
              },
            );
          };

          const fetchWalkIns = (cb) => {
            connection.execute(
              `SELECT channel_id, service_car_size_id,
                 TIME_FORMAT(start_service_datetime, '%H:%i') AS start_time,
                 TIME_FORMAT(end_service_datetime, '%H:%i') AS end_time
               FROM walk_in
               WHERE branch_id = ?
                 AND DATE(start_service_datetime) = ?`,
              [branchId, bookingDate],
              (wiErr, wiRows) => {
                if (wiErr) return cb(wiErr, null);
                const rows = wiRows || [];
                if (rows.length === 0) return cb(null, []);
                const ids = [...new Set(rows.map((r) => r.service_car_size_id))];
                const ph = ids.map(() => "?").join(",");
                connection.execute(
                  `SELECT id, COALESCE(required_staff, 1) AS required_staff FROM service_car_size WHERE id IN (${ph})`,
                  ids,
                  (rsErr, rsRows) => {
                    if (rsErr) return cb(rsErr, null);
                    const staffMap = {};
                    (rsRows || []).forEach((r) => {
                      staffMap[r.id] = r.required_staff || 1;
                    });
                    const enriched = rows.map((r) => ({
                      ...r,
                      required_staff: staffMap[r.service_car_size_id] || 1,
                    }));
                    cb(null, enriched);
                  },
                );
              },
            );
          };

          fetchBookings((bkErr, existingBookings) => {
            if (bkErr) return done(String(bkErr.message || bkErr), null);
            fetchWalkIns((wiErr, walkInRows) => {
              if (wiErr) return done(String(wiErr.message || wiErr), null);

              const bookingCountByChannel = {};
              const uniqueBookingsByChannel = {};
              for (const ch of channels) {
                bookingCountByChannel[ch.channel_id] = 0;
                uniqueBookingsByChannel[ch.channel_id] = new Set();
              }

              for (const b of existingBookings) {
                if (uniqueBookingsByChannel[b.channel_id]) {
                  uniqueBookingsByChannel[b.channel_id].add(b.booking_no);
                }
              }
              for (const ch of channels) {
                bookingCountByChannel[ch.channel_id] =
                  uniqueBookingsByChannel[ch.channel_id]?.size || 0;
              }
              for (const w of walkInRows) {
                if (bookingCountByChannel[w.channel_id] != null) {
                  bookingCountByChannel[w.channel_id] += 1;
                }
              }

              const sorted = [...channels].sort((a, b) => {
                const ca = bookingCountByChannel[a.channel_id] || 0;
                const cb_ = bookingCountByChannel[b.channel_id] || 0;
                if (ca !== cb_) return ca - cb_;
                return a.channel_id - b.channel_id;
              });

              const tryChannel = (idx) => {
                if (idx >= sorted.length) {
                  return done(
                    "ช่องที่รับบริการนี้เต็มความจุในช่วงเวลานี้ — ลองใหม่ภายหลัง",
                    null,
                  );
                }
                const channel = sorted[idx];
                const chStart = channel.chStart;
                const chEnd = channel.chEnd;
                const maxCapacity = channel.max_capacity;
                const timeline = new Array(1440).fill(0);

                for (const b of existingBookings) {
                  if (b.channel_id !== channel.channel_id) continue;
                  const sm = timeToMin(b.start_time);
                  const em = timeToMin(b.end_time);
                  const staff = b.required_staff || 1;
                  for (let m = sm; m < em && m < 1440; m++) {
                    timeline[m] += staff;
                  }
                }
                for (const w of walkInRows) {
                  if (w.channel_id !== channel.channel_id) continue;
                  const sm = timeToMin(w.start_time);
                  const em = timeToMin(w.end_time);
                  const staff = w.required_staff || 1;
                  for (let m = sm; m < em && m < 1440; m++) {
                    timeline[m] += staff;
                  }
                }

                if (nowMin + duration > chEnd) {
                  return tryChannel(idx + 1);
                }
                if (nowMin < chStart) {
                  return tryChannel(idx + 1);
                }

                let ok = true;
                for (let m = nowMin; m < nowMin + duration && m < 1440; m++) {
                  if (m < chStart || m >= chEnd) {
                    ok = false;
                    break;
                  }
                  if ((timeline[m] || 0) + requiredStaff > maxCapacity) {
                    ok = false;
                    break;
                  }
                }
                if (ok) {
                  return done(null, {
                    channel_id: channel.channel_id,
                    channel_name: channel.channel_name,
                  });
                }
                return tryChannel(idx + 1);
              };

              tryChannel(0);
            });
          });
        },
      );
    },
  );
}

module.exports = { resolveWalkInChannel };
