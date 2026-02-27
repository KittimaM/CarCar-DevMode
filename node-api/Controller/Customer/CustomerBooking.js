const Conn = require("../../db");

const GetBranches = (req, res) => {
  Conn.execute(
    `SELECT branch.id, branch.name, branch.address
     FROM branch
     WHERE EXISTS (
       SELECT 1 FROM channel
       JOIN channel_service ON channel_service.channel_id = channel.id AND channel_service.is_available = 1
       WHERE channel.branch_id = branch.id
     )
     ORDER BY branch.name`,
    null,
    function (error, results) {
      if (error) return res.json({ status: "ERROR", msg: error });
      if (results.length === 0) {
        return res.json({ status: "NO DATA", msg: "NO DATA" });
      }

      return res.json({ status: "SUCCESS", msg: results });
    },
  );
};

const PostGetServiceRatesByCarSize = (req, res) => {
  const { customer_car_id, branch_id } = req.body;
  Conn.execute(
    `
      SELECT 
          service_car_size.id AS id,
          service.name AS service_name,
          service_car_size.duration_minute,
          service_car_size.price,
          channel_schedule.channel_id,
          channel.max_capacity,
          channel_schedule.day_of_week,
          channel_schedule.start_time,
          channel_schedule.end_time
      FROM
          channel
              JOIN
          channel_service ON channel_service.channel_id = channel.id
              JOIN
          service_car_size ON service_car_size.id = channel_service.service_car_size_id
              JOIN
          service ON service.id = service_car_size.service_id
              JOIN
          customer_car ON customer_car.size_id = service_car_size.car_size_id
              JOIN
          channel_schedule ON channel_schedule.channel_id = channel.id
      WHERE
          channel_service.is_available = 1
              AND channel.branch_id = ?
              AND customer_car.id = ?;
        `,
    [branch_id, customer_car_id],
    function (error, results) {
      if (error) return res.json({ status: "ERROR", msg: error });
      if (results.length === 0)
        return res.json({
          status: "NO DATA",
          msg: "ไม่พบบริการที่รถคันนี้สามารถจองได้ กรุณาเลือกรถอื่น",
        });
      return res.json({ status: "SUCCESS", msg: results });
    },
  );
};

// Helper: time string "HH:mm" to minutes since midnight
// function timeToMin(t) {
//   const [h, m] = String(t).split(":").map(Number);
//   return (h || 0) * 60 + (m || 0);
// }
// function minToTime(min) {
//   const h = Math.floor(min / 60) % 24;
//   const m = min % 60;
//   return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
// }
// // Helper: do two time ranges overlap? (start/end in minutes)
// function overlaps(s1, e1, s2, e2) {
//   return !(e1 <= s2 || e2 <= s1);
// }

// // POST: Get available time slots (no recursive CTE - generate slots in Node to avoid ER_MALFORMED_PACKET)
// // Body: { branch_id, booking_date, service_car_size_id } or { branch_id, booking_date, service_car_size_ids: [6,7] }
// const GetAvailableSlots = (req, res) => {
//   const { branch_id, booking_date, service_car_size_id, service_car_size_ids } =
//     req.body;
//   const ids = service_car_size_ids;

//   const dayNames = [
//     "Sunday",
//     "Monday",
//     "Tuesday",
//     "Wednesday",
//     "Thursday",
//     "Friday",
//     "Saturday",
//   ];
//   const d = new Date(booking_date + "T12:00:00");
//   const dayOfWeek = dayNames[d.getDay()];
//   const placeholders = ids.map(() => "?").join(",");

//   Conn.execute(
//     `SELECT COALESCE(SUM(duration_minute),0) AS total FROM service_car_size WHERE id IN (${placeholders})`,
//     ids,
//     function (err, durRows) {
//       if (err) return res.json({ status: "ERROR", msg: err });
//       const totalMin = durRows?.[0]?.total || 0;
//       if (totalMin <= 0)
//         return res.json({
//           status: "ERROR",
//           msg: "Invalid service_car_size_id(s)",
//         });

//       Conn.execute(
//         `SELECT c.id AS channel_id, c.name AS channel_name, c.max_capacity,
//                 TIME_FORMAT(cs.start_time, '%H:%i') AS start_time, TIME_FORMAT(cs.end_time, '%H:%i') AS end_time
//          FROM channel c
//          JOIN channel_schedule cs ON cs.channel_id = c.id AND cs.day_of_week = ?
//          JOIN channel_service chs ON chs.channel_id = c.id AND chs.is_available = 1
//          WHERE c.branch_id = ? AND chs.service_car_size_id IN (${placeholders})
//          GROUP BY c.id, c.name, c.max_capacity, cs.start_time, cs.end_time
//          HAVING COUNT(DISTINCT chs.service_car_size_id) = ?`,
//         [dayOfWeek, branch_id, ...ids, ids.length],
//         function (errCh, channels) {
//           if (errCh) return res.json({ status: "ERROR", msg: errCh });
//           if (!channels || channels.length === 0)
//             return res.json({ status: "SUCCESS", msg: [], booked: [] });

//           Conn.execute(
//             `SELECT ch.id AS channel_id, TIME_FORMAT(b.start_time,'%H:%i') AS start_time, TIME_FORMAT(b.end_time,'%H:%i') AS end_time
//              FROM booking b
//              JOIN channel ch ON ch.id = b.channel_id
//              JOIN status st ON st.id = b.status_id
//              WHERE ch.branch_id = ? AND b.booking_date = ? AND st.code NOT IN ('CANCELLED','NO_SHOW')`,
//             [branch_id, booking_date],
//             function (errBk, bookings) {
//               if (errBk) return res.json({ status: "ERROR", msg: errBk });
//               const booked = (bookings || []).map((r) => ({
//                 channel_id: r.channel_id,
//                 start_min: timeToMin(r.start_time),
//                 end_min: timeToMin(r.end_time),
//               }));

//               const slots = [];
//               for (const ch of channels) {
//                 const chStart = timeToMin(ch.start_time);
//                 const chEnd = timeToMin(ch.end_time);
//                 const chBooked = booked.filter(
//                   (b) => b.channel_id === ch.channel_id,
//                 );

//                 for (let t = chStart; t + totalMin <= chEnd; t += totalMin) {
//                   const slotEnd = t + totalMin;
//                   const overlapCount = chBooked.filter((b) =>
//                     overlaps(t, slotEnd, b.start_min, b.end_min),
//                   ).length;
//                   if (overlapCount < ch.max_capacity) {
//                     slots.push({
//                       channel_id: ch.channel_id,
//                       channel_name: ch.channel_name,
//                       start_time: minToTime(t),
//                       end_time: minToTime(slotEnd),
//                     });
//                   }
//                 }
//               }
//               slots.sort((a, b) =>
//                 a.channel_id !== b.channel_id
//                   ? a.channel_id - b.channel_id
//                   : String(a.start_time).localeCompare(b.start_time),
//               );

//               const bookedForClient = booked.map((b) => ({
//                 start_time: minToTime(b.start_min),
//                 end_time: minToTime(b.end_min),
//               }));
//               return res.json({
//                 status: "SUCCESS",
//                 msg: slots,
//                 booked: bookedForClient,
//               });
//             },
//           );
//         },
//       );
//     },
//   );
// };

// // POST: Create booking (new schema)
// const CustomerBooking = (req, res) => {
//   try {
//     const token = req.headers.authorization?.split(" ")[1];
//     if (!token) return res.json({ status: "ERROR", msg: "token expired" });
//     const decoded = jwt.verify(token, secret);
//     const { id } = decoded;

//     const {
//       customer_car_id,
//       channel_id,
//       service_car_size_id,
//       booking_date,
//       start_time,
//       end_time,
//       price_snapshot,
//       duration_snapshot,
//     } = req.body;

//     if (
//       !customer_car_id ||
//       !channel_id ||
//       !service_car_size_id ||
//       !booking_date ||
//       !start_time ||
//       !end_time
//     ) {
//       return res.json({ status: "ERROR", msg: "Missing required fields" });
//     }

//     const bookingNo = generateBookingNo();

//     getStatusIdByCode("PENDING", (err, statusId) => {
//       if (err) return res.json({ status: "ERROR", msg: err.message });

//       Conn.execute(
//         `INSERT INTO booking (customer_car_id, channel_id, service_car_size_id, booking_date, start_time, end_time, price_snapshot, duration_snapshot, status_id, booking_no)
//          VALUES (?,?,?,?,?,?,?,?,?,?)`,
//         [
//           customer_car_id,
//           channel_id,
//           service_car_size_id,
//           booking_date,
//           start_time,
//           end_time,
//           price_snapshot ?? null,
//           duration_snapshot ?? null,
//           statusId,
//           bookingNo,
//         ],
//         function (error, result) {
//           if (error) return res.json({ status: "ERROR", msg: error });
//           return res.json({
//             status: "SUCCESS",
//             msg: { id: result.insertId, booking_no: bookingNo },
//           });
//         },
//       );
//     });
//   } catch (err) {
//     return res.json({ status: "ERROR", msg: "token expired" });
//   }
// };

// // GET: All bookings for logged-in customer (by customer_id from cars)
// const CustomerGetAllBooking = (req, res) => {
//   try {
//     const token = req.headers.authorization?.split(" ")[1];
//     if (!token) return res.json({ status: "ERROR", msg: "token expired" });
//     const { id } = jwt.verify(token, secret);

//     Conn.execute(
//       `SELECT b.*, s.name AS service_name, ch.name AS channel_name, br.name AS branch_name,
//               cc.plate_no, cc.brand, cc.model, st.code AS status_code
//        FROM booking b
//        JOIN customer_car cc ON cc.id = b.customer_car_id
//        LEFT JOIN service_car_size scs ON scs.id = b.service_car_size_id
//        LEFT JOIN service s ON s.id = scs.service_id
//        JOIN channel ch ON ch.id = b.channel_id
//        JOIN branch br ON br.id = ch.branch_id
//        JOIN status st ON st.id = b.status_id
//        WHERE cc.customer_id = ?
//        ORDER BY b.booking_date DESC, b.start_time DESC`,
//       [id],
//       function (error, results) {
//         if (error) return res.json({ status: "ERROR", msg: error });
//         if (results.length === 0)
//           return res.json({ status: "NO DATA", msg: "NO DATA" });
//         return res.json({ status: "SUCCESS", msg: results });
//       },
//     );
//   } catch (err) {
//     return res.json({ status: "ERROR", msg: "token expired" });
//   }
// };

// // DELETE: Cancel booking (customer can only delete own)
// const CustomerDeleteBooking = (req, res) => {
//   try {
//     const token = req.headers.authorization?.split(" ")[1];
//     if (!token) return res.json({ status: "ERROR", msg: "token expired" });
//     const { id } = jwt.verify(token, secret);
//     const { booking_id } = req.body;
//     if (!booking_id)
//       return res.json({ status: "ERROR", msg: "booking_id required" });

//     Conn.execute(
//       `DELETE b FROM booking b
//        JOIN customer_car cc ON cc.id = b.customer_car_id
//        WHERE b.id = ? AND cc.customer_id = ?`,
//       [booking_id, id],
//       function (error, result) {
//         if (error) return res.json({ status: "ERROR", msg: error });
//         if (result.affectedRows === 0)
//           return res.json({
//             status: "WARNING",
//             msg: "Booking not found or cannot delete",
//           });
//         return res.json({ status: "SUCCESS", msg: "SUCCESS" });
//       },
//     );
//   } catch (err) {
//     return res.json({ status: "ERROR", msg: "token expired" });
//   }
// };

// // Legacy: Get service choice by car_size (for backward compat)
// const CustomerGetServiceChoice = (req, res) => {
//   const { car_size_id } = req.body;
//   Conn.execute(
//     `SELECT scs.*, s.name AS service_name FROM service_car_size scs JOIN service s ON s.id = scs.service_id WHERE scs.car_size_id = ?`,
//     [car_size_id],
//     function (error, results) {
//       if (error) return res.json({ status: "ERROR", msg: error });
//       if (results.length === 0)
//         return res.json({ status: "NO DATA", msg: "NO DATA" });
//       return res.json({ status: "SUCCESS", msg: results });
//     },
//   );
// };

module.exports = {
  GetBranches,
  PostGetServiceRatesByCarSize,
};
