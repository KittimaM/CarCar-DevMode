const Conn = require("../../db");
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_WORD;

const generateBookingNo = () => {
  const now = new Date();
  const y = now.getFullYear().toString().slice(-2);
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `BK${y}${m}${d}${rand}`;
};

const timeToMin = (t) => {
  const [h, m] = String(t).split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
};

const overlaps = (s1, e1, s2, e2) => {
  return !(e1 <= s2 || e2 <= s1);
};

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
        channel.id AS channel_id,
        channel.priority,
        channel.max_capacity,
        channel_schedule.day_of_week,
        channel_schedule.start_time,
        channel_schedule.end_time
    FROM channel
    JOIN channel_service 
        ON channel_service.channel_id = channel.id
    JOIN service_car_size 
        ON service_car_size.id = channel_service.service_car_size_id
    JOIN service 
        ON service.id = service_car_size.service_id
    JOIN customer_car 
        ON customer_car.size_id = service_car_size.car_size_id
    JOIN channel_schedule 
        ON channel_schedule.channel_id = channel.id
    WHERE
        channel_service.is_available = 1
        AND channel.branch_id = ?
        AND customer_car.id = ?
    ORDER BY 
        service_car_size.id,
        channel.priority ASC,
        channel_schedule.day_of_week;
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

const PostGetAvailableSlots = (req, res) => {
  const { branch_id, booking_date, service_car_size_ids, customer_car_id } = req.body;
  const [year, month, day] = booking_date.split("-").map(Number);
  const d = new Date(year, month - 1, day); // month is 0-indexed
  const dayOfWeek = d.getDay();
  const placeholders = service_car_size_ids.map(() => "?").join(",");

  Conn.execute(
    `SELECT id, duration_minute, required_staff
     FROM service_car_size 
     WHERE id IN (${placeholders})`,
    service_car_size_ids,
    (durErr, durRows) => {
      if (durErr) return res.json({ status: "ERROR", msg: durErr.message });

      if (!durRows || durRows.length === 0) {
        return res.json({ status: "ERROR", msg: "Services not found" });
      }

      const totalDuration = durRows.reduce((s, r) => s + (r.duration_minute || 0), 0);
      const requiredStaff = durRows.reduce((s, r) => s + (r.required_staff || 1), 0);
      const serviceDurations = durRows.map((r) => ({
        service_car_size_id: r.id,
        duration_minute: r.duration_minute || 0,
      }));

      if (totalDuration === 0) {
        return res.json({ status: "ERROR", msg: "Invalid services" });
      }

      Conn.execute(
        `SELECT 
           c.id AS channel_id,
           c.name AS channel_name,
           c.priority,
           c.max_capacity,
           TIME_FORMAT(cs.start_time, '%H:%i') AS start_time,
           TIME_FORMAT(cs.end_time, '%H:%i') AS end_time
         FROM channel c
         JOIN channel_schedule cs ON cs.channel_id = c.id AND cs.day_of_week = ?
         JOIN channel_service chs ON chs.channel_id = c.id AND chs.is_available = 1
         WHERE c.branch_id = ? 
           AND chs.service_car_size_id IN (${placeholders})
         GROUP BY c.id, c.name, c.priority, c.max_capacity, cs.start_time, cs.end_time
         HAVING COUNT(DISTINCT chs.service_car_size_id) = ?`,
        [
          dayOfWeek,
          branch_id,
          ...service_car_size_ids,
          service_car_size_ids.length,
        ],
        (chErr, channels) => {
          if (chErr) return res.json({ status: "ERROR", msg: chErr.message });

          if (!channels || channels.length === 0) {
            return res.json({ status: "NO DATA", msg: "NO DATA" });
          }

          // Step 3: Get existing bookings WITH required_staff from each booking's services
          const channelIds = channels.map((c) => c.channel_id);
          const chPlaceholders = channelIds.map(() => "?").join(",");

          Conn.execute(
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
            [...channelIds, booking_date],
            (bkErr, existingBookings) => {
              if (bkErr)
                return res.json({ status: "ERROR", msg: bkErr.message });

              const fetchCustomerBookings = (done) => {
                if (!customer_car_id) return done(null, []);
                Conn.execute(
                  `SELECT MIN(TIME_TO_SEC(b.start_time))/60 AS start_min, MAX(TIME_TO_SEC(b.end_time))/60 AS end_min
                   FROM booking b
                   JOIN status st ON st.id = b.status_id
                   WHERE b.customer_car_id = ? AND b.booking_date = ?
                     AND st.code IN ('PENDING', 'CONFIRMED')
                   GROUP BY b.booking_no`,
                  [customer_car_id, booking_date],
                  (custErr, rows) => {
                    if (custErr) return done(custErr, null);
                    const ranges = (rows || []).map((r) => ({
                      start: Math.floor(r.start_min) || 0,
                      end: Math.floor(r.end_min) || 0,
                    }));
                    done(null, ranges);
                  }
                );
              };

              fetchCustomerBookings((custErr, customerBookingRanges) => {
                if (custErr) return res.json({ status: "ERROR", msg: custErr.message });
                const capacityTimeline = {};

              for (const channel of channels) {
                capacityTimeline[channel.channel_id] = new Array(1440).fill(0);
              }

              const bookingCountByChannel = {};
              const uniqueBookingsByChannel = {};
              for (const ch of channels) {
                bookingCountByChannel[ch.channel_id] = 0;
                uniqueBookingsByChannel[ch.channel_id] = new Set();
              }
              for (const b of existingBookings) {
                const startMin = timeToMin(b.start_time);
                const endMin = timeToMin(b.end_time);
                const staff = b.required_staff;

                if (capacityTimeline[b.channel_id]) {
                  for (let m = startMin; m < endMin; m++) {
                    capacityTimeline[b.channel_id][m] += staff;
                  }
                }
                if (uniqueBookingsByChannel[b.channel_id]) {
                  uniqueBookingsByChannel[b.channel_id].add(b.booking_no);
                }
              }
              for (const ch of channels) {
                bookingCountByChannel[ch.channel_id] = uniqueBookingsByChannel[ch.channel_id]?.size || 0;
              }
              // Step 5: Generate slots for EACH channel using pre-calc timeline
              const allSlots = [];

              for (const channel of channels) {
                const chStart = timeToMin(channel.start_time);
                const chEnd = timeToMin(channel.end_time);
                const maxCapacity = channel.max_capacity;
                const timeline = capacityTimeline[channel.channel_id];

                for (let t = chStart; t + totalDuration <= chEnd; t += totalDuration) {
                  const slotEnd = t + totalDuration;

                  // Find max capacity used in this slot range (O(duration) instead of O(bookings))
                  let maxUsedInSlot = 0;
                  for (let m = t; m < slotEnd; m++) {
                    if (timeline[m] > maxUsedInSlot) {
                      maxUsedInSlot = timeline[m];
                    }
                  }

                  // Check if adding requiredStaff would exceed maxCapacity
                  if (maxUsedInSlot + requiredStaff <= maxCapacity) {
                    const slotStartMin = t;
                    const slotEndMin = slotEnd;
                    const overlapsCustomerBooking = customerBookingRanges.some(
                      (r) => overlaps(slotStartMin, slotEndMin, r.start, r.end)
                    );
                    if (overlapsCustomerBooking) continue;

                    const startTime = `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
                    const endTime = `${String(Math.floor(slotEnd / 60)).padStart(2, "0")}:${String(slotEnd % 60).padStart(2, "0")}`;

                    allSlots.push({
                      channel_id: channel.channel_id,
                      channel_name: channel.channel_name,
                      priority: channel.priority,
                      booking_count: bookingCountByChannel[channel.channel_id] || 0,
                      start_time: startTime,
                      end_time: endTime,
                      duration: totalDuration,
                      required_staff: requiredStaff,
                      services: serviceDurations,
                    });
                  }
                }
              }

              // Step 6: Sort by priority, then by least booking, then by start_time
              allSlots.sort((a, b) => {
                if (a.priority !== b.priority) {
                  return a.priority - b.priority;
                }
                if (a.booking_count !== b.booking_count) {
                  return a.booking_count - b.booking_count;
                }
                return a.start_time.localeCompare(b.start_time);
              });

              return res.json({
                status: "SUCCESS",
                msg: allSlots,
              });
              });
            },
          );
        },
      );
    },
  );
};

const PostAddCustomerBooking = (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.json({ status: "ERROR", msg: "token expired" });
    const decoded = jwt.verify(token, secret);
    const { id: customerId } = decoded;

    const {
      customer_car_id,
      channel_id,
      service_car_size_ids,
      booking_date,
      start_time,
      end_time,
    } = req.body;

    if (
      !customer_car_id ||
      !channel_id ||
      !service_car_size_ids ||
      !service_car_size_ids.length ||
      !booking_date ||
      !start_time ||
      !end_time
    ) {
      return res.json({ status: "ERROR", msg: "Missing required fields" });
    }

    Conn.getConnection((connErr, connection) => {
      if (connErr) return res.json({ status: "ERROR", msg: connErr.message });

      connection.beginTransaction((txErr) => {
        if (txErr) {
          connection.release();
          return res.json({ status: "ERROR", msg: txErr.message });
        }

        connection.execute(
          `SELECT id, max_capacity FROM channel WHERE id = ? FOR UPDATE`,
          [channel_id],
          (chErr, channelRows) => {
            if (chErr) {
              return connection.rollback(() => {
                connection.release();
                res.json({ status: "ERROR", msg: chErr.message });
              });
            }
            if (channelRows.length === 0) {
              return connection.rollback(() => {
                connection.release();
                res.json({ status: "ERROR", msg: "Channel not found" });
              });
            }

            const maxCapacity = channelRows[0].max_capacity;

            // Get required_staff for the services being booked
            const placeholders = service_car_size_ids.map(() => "?").join(",");
            connection.execute(
              `SELECT id, price, duration_minute, required_staff FROM service_car_size WHERE id IN (${placeholders})`,
              service_car_size_ids,
              (svcErr, svcRows) => {
                if (svcErr) {
                  return connection.rollback(() => {
                    connection.release();
                    res.json({ status: "ERROR", msg: svcErr.message });
                  });
                }

                const requiredStaff = svcRows.reduce(
                  (sum, s) => sum + (s.required_staff || 1),
                  0,
                );

                // Check if customer_car already has overlapping booking on same date
                connection.execute(
                  `SELECT MIN(TIME_TO_SEC(b.start_time))/60 AS start_min, MAX(TIME_TO_SEC(b.end_time))/60 AS end_min
                   FROM booking b
                   JOIN status st ON st.id = b.status_id
                   WHERE b.customer_car_id = ? AND b.booking_date = ?
                     AND st.code IN ('PENDING', 'CONFIRMED')
                   GROUP BY b.booking_no`,
                  [customer_car_id, booking_date],
                  (custErr, custRows) => {
                    if (custErr) {
                      return connection.rollback(() => {
                        connection.release();
                        res.json({ status: "ERROR", msg: custErr.message });
                      });
                    }
                    const startMin = timeToMin(start_time);
                    const endMin = timeToMin(end_time);
                    const customerRanges = (custRows || []).map((r) => ({
                      start: Math.floor(r.start_min) || 0,
                      end: Math.floor(r.end_min) || 0,
                    }));
                    const hasOverlap = customerRanges.some((r) =>
                      overlaps(startMin, endMin, r.start, r.end)
                    );
                    if (hasOverlap) {
                      return connection.rollback(() => {
                        connection.release();
                        res.json({
                          status: "ERROR",
                          msg: "รถคันนี้มีการจองในช่วงเวลานี้อยู่แล้ว",
                        });
                      });
                    }

                    // Get existing bookings with their required_staff
                    connection.execute(
                      `SELECT b.id, b.start_time, b.end_time, COALESCE(scs.required_staff, 1) AS required_staff
                   FROM booking b
                   LEFT JOIN service_car_size scs ON scs.id = b.service_car_size_id
                   WHERE b.channel_id = ? 
                     AND b.booking_date = ? 
                     AND b.status_id IN (SELECT id FROM status WHERE code IN ('PENDING', 'CONFIRMED'))
                   FOR UPDATE`,
                      [channel_id, booking_date],
                      (bkErr, existingBookings) => {
                    if (bkErr) {
                      return connection.rollback(() => {
                        connection.release();
                        res.json({ status: "ERROR", msg: bkErr.message });
                      });
                    }

                    const startMin = timeToMin(start_time);
                    const endMin = timeToMin(end_time);

                    // Build capacity timeline for the slot range
                    const timeline = new Array(endMin - startMin).fill(0);

                    for (const b of existingBookings) {
                      const bStart = timeToMin(b.start_time);
                      const bEnd = timeToMin(b.end_time);
                      const staff = b.required_staff || 1;

                      // Check overlap and add to timeline
                      if (overlaps(startMin, endMin, bStart, bEnd)) {
                        const overlapStart =
                          Math.max(startMin, bStart) - startMin;
                        const overlapEnd = Math.min(endMin, bEnd) - startMin;
                        for (let m = overlapStart; m < overlapEnd; m++) {
                          timeline[m] += staff;
                        }
                      }
                    }

                    // Find max used capacity in the slot
                    const maxUsedInSlot = Math.max(...timeline, 0);

                    if (maxUsedInSlot + requiredStaff > maxCapacity) {
                      return connection.rollback(() => {
                        connection.release();
                        res.json({
                          status: "ERROR",
                          msg: "ช่วงเวลานี้เต็มแล้ว กรุณาเลือกเวลาอื่น",
                        });
                      });
                    }

                    // Services already fetched above (svcRows), continue with booking
                    const totalPrice = svcRows.reduce(
                      (sum, s) => sum + Number(s.price),
                      0,
                    );
                    const totalDuration = svcRows.reduce(
                      (sum, s) => sum + s.duration_minute,
                      0,
                    );

                    connection.execute(
                      `SELECT id FROM status WHERE code = 'PENDING' LIMIT 1`,
                      [],
                      (stErr, stRows) => {
                        if (stErr || stRows.length === 0) {
                          return connection.rollback(() => {
                            connection.release();
                            res.json({
                              status: "ERROR",
                              msg: stErr?.message || "PENDING status not found",
                            });
                          });
                        }

                        const statusId = stRows[0].id;
                        const bookingNo = generateBookingNo();
                        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

                        const insertBookings = (index, bookingIds) => {
                          if (index >= service_car_size_ids.length) {
                            connection.commit((commitErr) => {
                              connection.release();
                              if (commitErr) {
                                return res.json({
                                  status: "ERROR",
                                  msg: commitErr.message,
                                });
                              }
                              return res.json({
                                status: "SUCCESS",
                                msg: {
                                  booking_no: bookingNo,
                                  booking_ids: bookingIds,
                                  expires_at: expiresAt,
                                },
                              });
                            });
                            return;
                          }

                          const svcId = service_car_size_ids[index];
                          const svc = svcRows.find((s) => s.id === svcId);
                          const price = svc ? Number(svc.price) : 0;
                          const duration = svc ? svc.duration_minute : 0;

                          connection.execute(
                            `INSERT INTO booking 
                             (booking_no, customer_car_id, channel_id, service_car_size_id, booking_date, start_time, end_time, price_snapshot, duration_snapshot, status_id, expires_at)
                             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                            [
                              bookingNo,
                              customer_car_id,
                              channel_id,
                              svcId,
                              booking_date,
                              start_time,
                              end_time,
                              price,
                              duration,
                              statusId,
                              expiresAt,
                            ],
                            (insErr, insResult) => {
                              if (insErr) {
                                return connection.rollback(() => {
                                  connection.release();
                                  res.json({
                                    status: "ERROR",
                                    msg: insErr.message,
                                  });
                                });
                              }
                              insertBookings(index + 1, [
                                ...bookingIds,
                                insResult.insertId,
                              ]);
                            },
                          );
                        };

                        insertBookings(0, []);
                      },
                    );
                  },
                );
                  },
                );
              },
            );
          },
        );
      });
    });
  } catch (err) {
    return res.json({ status: "ERROR", msg: "token expired" });
  }
};

module.exports = {
  GetBranches,
  PostGetServiceRatesByCarSize,
  PostGetAvailableSlots,
  PostAddCustomerBooking,
};
