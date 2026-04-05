import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  GetAllBooking,
  GetAllCarSize,
  GetAllBranch,
  GetAllChannel,
  GetAllChannelSchedule,
  PostAddAdminBooking,
  PostWalkInServices,
} from "./Modules/Api";

const emptyForm = () => ({
  customer_name: "",
  customer_phone: "",
  car_no: "",
  car_size_id: "",
  car_color: "",
  service: "",
});

function formatLocalMysqlDatetime(d) {
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  const s = String(d.getSeconds()).padStart(2, "0");
  return `${y}-${mo}-${day} ${h}:${mi}:${s}`;
}

/** ตรงกับ channel_schedule.day_of_week (ENUM) — JS getDay(): 0=อาทิตย์ */
const SCHEDULE_DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function timeStrToMinutes(str) {
  const [h, m] = String(str || "0:0").split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

/** ช่องเปิดรับ Walk-in ณ เวลา `now` หรือไม่ (ตามตารางวันนั้น) */
function isChannelOpenAtTime(channelId, schedules, now) {
  const dayName = SCHEDULE_DAY_NAMES[now.getDay()];
  const rows = (schedules || []).filter(
    (s) =>
      Number(s.channel_id) === Number(channelId) && s.day_of_week === dayName,
  );
  if (rows.length === 0) return false;
  const cur = now.getHours() * 60 + now.getMinutes();
  return rows.some((row) => {
    const s = timeStrToMinutes(row.start_time);
    const e = timeStrToMinutes(row.end_time);
    if (e <= s) return cur >= s || cur < e;
    return cur >= s && cur < e;
  });
}

function filterWalkInEligibleByBranch(channels, branchId) {
  if (!branchId) return [];
  return (channels || []).filter((c) => {
    const mode = c.booking_mode || "BOTH";
    if (mode !== "WALK_IN_ONLY" && mode !== "BOTH") return false;
    return String(c.branch_id) === String(branchId);
  });
}

const AdminHome = () => {
  const [bookings, setBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [carSizes, setCarSizes] = useState([]);
  const [walkInServices, setWalkInServices] = useState([]);
  const [walkInServicesLoading, setWalkInServicesLoading] = useState(false);
  const [branches, setBranches] = useState([]);
  const [channels, setChannels] = useState([]);
  const [channelSchedules, setChannelSchedules] = useState([]);
  const [walkInClockTick, setWalkInClockTick] = useState(() => new Date());
  const [selectedBranch, setSelectedBranch] = useState("");
  const [walkInBranchId, setWalkInBranchId] = useState("");
  const [walkInNowTick, setWalkInNowTick] = useState(() => new Date());
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    fetchTodayBookings();
    fetchFormData();
  }, []);

  const filterBookingsByBranch = useCallback(() => {
    if (!selectedBranch) {
      setBookings(allBookings);
    } else {
      const filtered = allBookings.filter(
        (b) => String(b.branch_id) === String(selectedBranch),
      );
      setBookings(filtered);
    }
  }, [selectedBranch, allBookings]);

  useEffect(() => {
    filterBookingsByBranch();
  }, [filterBookingsByBranch]);

  useEffect(() => {
    if (!selectedBranch || branches.length === 0) return;
    const stillExists = branches.some((b) => String(b.id) === String(selectedBranch));
    if (!stillExists) setSelectedBranch("");
  }, [branches, selectedBranch]);

  const fetchFormData = () => {
    GetAllCarSize().then((data) => {
      if (data.status === "SUCCESS") setCarSizes(data.msg);
    });
    GetAllBranch().then((data) => {
      if (data.status === "SUCCESS") setBranches(data.msg);
      else if (data.status === "NO DATA") setBranches([]);
    });
    GetAllChannel().then((data) => {
      if (data?.status === "SUCCESS") setChannels(data.msg);
    });
    GetAllChannelSchedule().then((data) => {
      if (data?.status === "SUCCESS") setChannelSchedules(data.msg);
      else setChannelSchedules([]);
    });
  };

  useEffect(() => {
    const t = setInterval(() => setWalkInClockTick(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  const walkInChannelsForBranch = useMemo(() => {
    const bid =
      branches.length === 1 ? String(branches[0].id) : walkInBranchId;
    return filterWalkInEligibleByBranch(channels, bid);
  }, [channels, walkInBranchId, branches]);

  /** ช่อง Walk-in ที่อยู่ในช่วงเวลาเปิดตามตาราง (ใช้ในโมดัล — อัปเดตทุก 1 วิ) */
  const walkInChannelsOpenInModal = useMemo(() => {
    return walkInChannelsForBranch.filter((c) =>
      isChannelOpenAtTime(c.id, channelSchedules, walkInNowTick),
    );
  }, [walkInChannelsForBranch, channelSchedules, walkInNowTick]);

  /** สาขาที่ใช้ตรวจปุ่ม Walk-in (สาขาเดียว หรือสาขาที่เลือกในเมนู) */
  const walkInBranchIdForToolbar = useMemo(() => {
    if (branches.length === 1) return String(branches[0].id);
    return selectedBranch ? String(selectedBranch) : "";
  }, [branches, selectedBranch]);

  const walkInEligibleForToolbar = useMemo(
    () => filterWalkInEligibleByBranch(channels, walkInBranchIdForToolbar),
    [channels, walkInBranchIdForToolbar],
  );

  /** ช่อง Walk-in ที่เปิดอยู่ ณ เวลานี้ — ใช้ปิดปุ่มถ้าไม่มีช่อง */
  const walkInChannelsOpenForToolbar = useMemo(() => {
    return walkInEligibleForToolbar.filter((c) =>
      isChannelOpenAtTime(c.id, channelSchedules, walkInClockTick),
    );
  }, [walkInEligibleForToolbar, channelSchedules, walkInClockTick]);

  useEffect(() => {
    if (!showForm) return;
    const t = setInterval(() => setWalkInNowTick(new Date()), 1000);
    return () => clearInterval(t);
  }, [showForm]);

  useEffect(() => {
    if (!showForm) {
      setWalkInServices([]);
      setWalkInServicesLoading(false);
      return;
    }
    const bid =
      branches.length === 1 ? String(branches[0].id) : walkInBranchId;
    const sz = formData.car_size_id;
    if (!bid || !sz) {
      setWalkInServices([]);
      setWalkInServicesLoading(false);
      return;
    }
    let cancelled = false;
    setWalkInServicesLoading(true);
    PostWalkInServices({
      branch_id: bid,
      car_size_id: sz,
    }).then((data) => {
      if (cancelled) return;
      setWalkInServicesLoading(false);
      if (data?.status === "SUCCESS" && Array.isArray(data.msg)) {
        setWalkInServices(data.msg);
      } else {
        setWalkInServices([]);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [showForm, formData.car_size_id, walkInBranchId, branches]);

  useEffect(() => {
    if (!showForm) return;
    setFormData((prev) => {
      if (!prev.service) return prev;
      const ok = walkInServices.some(
        (s) => String(s.service_car_size_id) === String(prev.service),
      );
      if (ok) return prev;
      return { ...prev, service: "" };
    });
  }, [walkInServices, showForm]);

  const fetchTodayBookings = () => {
    setLoading(true);
    GetAllBooking().then((data) => {
      const { status, msg } = data;
      if (status === "SUCCESS") {
        const today = new Date().toISOString().split("T")[0];
        const todayBookings = msg.filter((booking) => {
          const bookingDate =
            booking.start_service_datetime?.split(" ")[0] || booking.booking_date;
          return bookingDate === today;
        });
        const sortedBookings = todayBookings.sort((a, b) => {
          const timeA = a.start_service_datetime || a.start_time || "";
          const timeB = b.start_service_datetime || b.start_time || "";
          return timeA.localeCompare(timeB);
        });
        setAllBookings(sortedBookings);
      } else {
        setAllBookings([]);
      }
      setLoading(false);
    });
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { label: "รอดำเนินการ", color: "bg-yellow-100 text-yellow-800" },
      confirmed: { label: "ยืนยันแล้ว", color: "bg-blue-100 text-blue-800" },
      in_progress: { label: "กำลังดำเนินการ", color: "bg-purple-100 text-purple-800" },
      completed: { label: "เสร็จสิ้น", color: "bg-green-100 text-green-800" },
      cancelled: { label: "ยกเลิก", color: "bg-red-100 text-red-800" },
    };
    const statusInfo =
      statusMap[status] || { label: status || "ไม่ทราบ", color: "bg-gray-100 text-gray-800" };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    );
  };

  const formatTime = (datetime) => {
    if (!datetime) return "-";
    const time = datetime.split(" ")[1] || datetime;
    return time.substring(0, 5);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "car_size_id") {
        next.service = "";
      }
      return next;
    });
  };

  const branchSelectedForWalkIn =
    branches.length === 1 ||
    (branches.length > 1 && Boolean(selectedBranch));

  const canOpenWalkIn =
    branchSelectedForWalkIn && walkInChannelsOpenForToolbar.length > 0;

  const openWalkInModal = () => {
    if (branches.length > 1 && !selectedBranch) {
      alert("กรุณาเลือกสาขาจากเมนูด้านบนก่อน จึงจะบันทึกลูกค้า Walk-in ได้");
      return;
    }
    const defaultBranch =
      selectedBranch ||
      (branches.length === 1 ? String(branches[0].id) : "");
    setWalkInBranchId(defaultBranch);
    setFormData(emptyForm());
    setWalkInServices([]);
    setWalkInNowTick(new Date());
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const branchIdResolved =
      branches.length === 1 ? String(branches[0].id) : walkInBranchId;
    if (branches.length > 1 && !walkInBranchId) {
      alert("กรุณาเลือกสาขา");
      return;
    }
    if (walkInChannelsOpenInModal.length === 0) {
      alert(
        "ไม่มีช่อง Walk-in ที่เปิดให้บริการในช่วงเวลานี้ (ตามตารางช่อง) หรือไม่มีช่องที่รับ Walk-in ในสาขานี้",
      );
      return;
    }
    const walkInSvc = walkInServices.find(
      (s) => String(s.service_car_size_id) === String(formData.service),
    );
    if (!formData.service || !walkInSvc) {
      alert(
        "กรุณาเลือกบริการ — ต้องเป็นบริการที่ผูกกับขนาดรถใน Channel matching และเปิดใช้งานในสาขานี้",
      );
      return;
    }

    setSubmitting(true);
    const selectedCarSize = carSizes.find(
      (c) => c.id === parseInt(formData.car_size_id, 10),
    );
    const selectedBranchData = branches.find(
      (b) => String(b.id) === String(branchIdResolved),
    );
    const now = new Date();
    const startDatetime = formatLocalMysqlDatetime(now);
    const durationMin = walkInSvc.duration_minute || 60;
    const endD = new Date(now);
    endD.setMinutes(endD.getMinutes() + durationMin);
    const endDatetime = formatLocalMysqlDatetime(endD);

    const bookingData = {
      customer_name: formData.customer_name,
      customer_phone: formData.customer_phone,
      car_no: formData.car_no,
      car_size_id: formData.car_size_id,
      car_size: selectedCarSize?.size || "",
      car_color: formData.car_color,
      service: walkInSvc.service_name,
      payment_type_id: null,
      branch_id: branchIdResolved,
      branch_name: selectedBranchData?.name || "",
      start_service_datetime: startDatetime,
      end_service_datetime: endDatetime,
      service_usetime: durationMin,
      service_price: walkInSvc.price != null ? Number(walkInSvc.price) : 0,
      service_car_size_id: walkInSvc.service_car_size_id,
      is_walk_in: true,
    };

    PostAddAdminBooking(bookingData).then((data) => {
      setSubmitting(false);
      if (data.status === "SUCCESS") {
        setShowForm(false);
        setFormData(emptyForm());
        fetchTodayBookings();
      } else {
        alert(
          "เกิดข้อผิดพลาด: " +
            (typeof data?.msg === "string"
              ? data.msg
              : data?.msg || "ไม่สามารถเพิ่มคิวได้"),
        );
      }
    });
  };

  return (
    <div className="h-full">
      <div className="flex flex-col flex-wrap sm:flex-row sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800">หน้าหลัก</h1>
          {branches.length > 1 && (
            <div className="flex flex-col gap-1">
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="select select-bordered min-w-[200px] h-10 px-3 text-sm"
              >
                <option value="">— เลือกสาขา —</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
              {!selectedBranch && (
                <span className="text-xs text-amber-700">
                  เลือกสาขาก่อน จึงจะใช้ปุ่ม &quot;+ ลูกค้า Walk-in&quot; ได้
                </span>
              )}
              {selectedBranch &&
                walkInEligibleForToolbar.length > 0 &&
                walkInChannelsOpenForToolbar.length === 0 && (
                  <span className="text-xs text-gray-600">
                    ช่อง Walk-in ยังไม่อยู่ในช่วงเวลาเปิด (ตามตารางช่อง) — ปุ่ม Walk-in จะใช้ไม่ได้ชั่วคราว
                  </span>
                )}
            </div>
          )}
        </div>
        <div className="flex gap-2 items-center ">
          <button
            type="button"
            onClick={openWalkInModal}
            disabled={!canOpenWalkIn}
            title={
              !branchSelectedForWalkIn && branches.length > 1
                ? "กรุณาเลือกสาขาจากเมนูด้านบนก่อน"
                : branchSelectedForWalkIn && walkInChannelsOpenForToolbar.length === 0
                  ? walkInEligibleForToolbar.length === 0
                    ? "ไม่มีช่องที่รับ Walk-in ในสาขานี้ (ตรวจสอบ Master Data)"
                    : "ไม่มีช่อง Walk-in ที่เปิดในช่วงเวลานี้ (ตามตารางช่อง)"
                  : undefined
            }
            className="btn btn-sm border-emerald-600/30 bg-emerald-50 text-emerald-900 hover:bg-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            + ลูกค้า Walk-in
          </button>
          <button onClick={fetchTodayBookings} className="btn btn-sm btn-outline">
            รีเฟรช
          </button>
        </div>
        {branches.length === 1 &&
          walkInEligibleForToolbar.length > 0 &&
          walkInChannelsOpenForToolbar.length === 0 && (
            <p className="w-full text-xs text-gray-600 order-last sm:text-right">
              ช่อง Walk-in ยังไม่อยู่ในช่วงเวลาเปิด (ตามตารางช่อง) — ปุ่ม Walk-in จะใช้ไม่ได้ชั่วคราว
            </p>
          )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto">
            <div className="px-6 py-4 border-b bg-emerald-700 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">ลูกค้า Walk-in</h2>
                  <p className="text-xs text-emerald-100 mt-0.5">
                    ระบบจะจัดช่องอัตโนมัติตามความพร้อมของคิว (เหมือนการจองลูกค้า) · วันที่จองเป็นวันนี้ ตามเวลาปัจจุบัน
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn btn-sm btn-circle btn-ghost text-white hover:bg-emerald-800"
                >
                  ✕
                </button>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <label className="label pt-0">
                  <span className="label-text font-medium">สาขา *</span>
                </label>
                {branches.length === 1 ? (
                  <p className="text-sm font-semibold text-gray-800">{branches[0].name}</p>
                ) : (
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {branches.find((b) => String(b.id) === String(walkInBranchId))?.name ||
                        "—"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      สาขานี้มาจากที่เลือกไว้ด้านบน (เปลี่ยนสาขาได้ที่ตัวกรองก่อนเปิดฟอร์ม)
                    </p>
                  </div>
                )}
              </div>

              <div className="rounded-lg border border-emerald-200 bg-emerald-50/80 p-4">
                <h3 className="text-sm font-semibold text-emerald-900 mb-2">
                  วันที่และเวลา (ล็อกเป็นปัจจุบัน)
                </h3>
                <p className="text-sm text-emerald-800">
                  วันที่จอง:{" "}
                  <span className="font-mono font-semibold">
                    {walkInNowTick.toLocaleDateString("th-TH", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </p>
                <p className="text-sm text-emerald-800 mt-1">
                  เวลาเริ่มบริการจะถูกบันทึกเป็นเวลาปัจจุบัน ณ ขณะกด &quot;บันทึก Walk-in&quot; (
                  <span className="font-mono font-semibold">
                    {walkInNowTick.toLocaleTimeString("th-TH")}
                  </span>
                  )
                </p>
                <p className="text-xs text-emerald-700/90 mt-2">
                  ไม่สามารถเลือกวันที่ย้อนหลังหรือล่วงหน้าได้
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <label className="label pt-0">
                  <span className="label-text font-medium">การจัดช่อง</span>
                </label>
                {!walkInBranchId && branches.length > 1 ? (
                  <p className="text-sm text-amber-700">เลือกสาขาก่อน (ด้านบน) จึงจะบันทึก Walk-in ในสาขานี้ได้</p>
                ) : walkInChannelsForBranch.length === 0 ? (
                  <p className="text-sm text-error">
                    ไม่มีช่องที่ตั้งค่าเป็น &quot;Walk-in เท่านั้น&quot; หรือ &quot;จอง+Walk-in&quot; ในสาขานี้
                  </p>
                ) : walkInChannelsOpenInModal.length === 0 ? (
                  <p className="text-sm text-error">
                    ช่อง Walk-in ในสาขานี้ยังไม่อยู่ในช่วงเวลาเปิดให้บริการ (ตามตารางช่อง) — ลองใหม่เมื่อถึงเวลาเปิด
                  </p>
                ) : (
                  <p className="text-sm text-gray-700">
                    ไม่ต้องเลือกช่อง — ระบบจะเลือกช่องที่ว่างและรับบริการนี้ได้ โดยคำนึงถึงความจุต่อนาทีและจำนวนคิว (เหมือนลูกค้าจองผ่านแอป)
                  </p>
                )}
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">ข้อมูลลูกค้า</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">ชื่อลูกค้า *</span>
                    </label>
                    <input
                      type="text"
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={handleInputChange}
                      required
                      className="input input-bordered w-full"
                      placeholder="กรอกชื่อลูกค้า"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">เบอร์โทรศัพท์</span>
                    </label>
                    <input
                      type="tel"
                      name="customer_phone"
                      value={formData.customer_phone}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
                      placeholder="กรอกเบอร์โทร"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">ข้อมูลรถ</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">ทะเบียนรถ *</span>
                    </label>
                    <input
                      type="text"
                      name="car_no"
                      value={formData.car_no}
                      onChange={handleInputChange}
                      required
                      className="input input-bordered w-full"
                      placeholder="เช่น กข 1234"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">ขนาดรถ *</span>
                    </label>
                    <select
                      name="car_size_id"
                      value={formData.car_size_id}
                      onChange={handleInputChange}
                      required
                      className="select select-bordered w-full"
                    >
                      <option value="">เลือกขนาดรถ</option>
                      {carSizes.map((cs) => (
                        <option key={cs.id} value={cs.id}>
                          {cs.size}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">สีรถ</span>
                    </label>
                    <input
                      type="text"
                      name="car_color"
                      value={formData.car_color}
                      onChange={handleInputChange}
                      className="input input-bordered w-full"
                      placeholder="เช่น ขาว, ดำ"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">บริการ</h3>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">บริการ *</span>
                  </label>
                  {!formData.car_size_id ? (
                    <p className="text-sm text-amber-700">เลือกขนาดรถก่อน — บริการขึ้นกับขนาดรถและการผูกช่อง (Channel matching) ในสาขานี้</p>
                  ) : walkInServicesLoading ? (
                    <div className="flex items-center gap-2 text-sm text-gray-600 py-2">
                      <span className="loading loading-spinner loading-sm" />
                      กำลังโหลดบริการที่ใช้ได้…
                    </div>
                  ) : walkInServices.length === 0 ? (
                    <p className="text-sm text-error">
                      ไม่มีบริการที่พร้อมใช้สำหรับขนาดรถนี้ในสาขา — ตรวจสอบ Channel matching ว่ามีการผูกบริการและเปิดใช้งาน
                      (is available) บนช่อง Walk-in อย่างน้อยหนึ่งช่อง
                    </p>
                  ) : (
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      required
                      className="select select-bordered w-full"
                    >
                      <option value="">เลือกบริการ</option>
                      {walkInServices.map((svc) => (
                        <option
                          key={svc.service_car_size_id}
                          value={String(svc.service_car_size_id)}
                        >
                          {svc.service_name} · {svc.duration_minute} นาที · ฿
                          {Number(svc.price || 0).toLocaleString()}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn btn-outline flex-1 h-12"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={
                    submitting ||
                    walkInChannelsOpenInModal.length === 0 ||
                    !walkInBranchId ||
                    walkInServicesLoading ||
                    !formData.car_size_id ||
                    walkInServices.length === 0 ||
                    !formData.service
                  }
                  className="btn btn-primary flex-1 h-12 bg-emerald-600 border-emerald-600 hover:bg-emerald-700"
                >
                  {submitting ? (
                    <span className="loading loading-spinner" />
                  ) : (
                    "บันทึก Walk-in"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-xl">📋</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">คิววันนี้</p>
              <p className="text-2xl font-bold text-gray-800">{bookings.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-yellow-600 text-xl">⏳</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">รอดำเนินการ</p>
              <p className="text-2xl font-bold text-gray-800">
                {bookings.filter((b) => b.processing_status === "pending" || !b.processing_status).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-xl">✅</span>
            </div>
            <div>
              <p className="text-sm text-gray-500">เสร็จสิ้น</p>
              <p className="text-2xl font-bold text-gray-800">
                {bookings.filter((b) => b.processing_status === "completed").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">คิววันนี้</h2>
          <p className="text-sm text-gray-500">
            {new Date().toLocaleDateString("th-TH", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <span className="loading loading-spinner loading-md"></span>
            <p className="mt-2 text-gray-500">กำลังโหลด...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">ไม่มีการจองวันนี้</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left">คิว</th>
                  <th className="text-left">เวลา</th>
                  <th className="text-left">ลูกค้า</th>
                  <th className="text-left">รถ</th>
                  <th className="text-left">บริการ</th>
                  {branches.length > 1 && <th className="text-left">สาขา</th>}
                  <th className="text-left">สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking, index) => (
                  <tr
                    key={`${booking.row_source || "booking"}-${booking.id}`}
                    className="hover:bg-gray-50"
                  >
                    <td>
                      <span className="font-bold text-lg text-blue-600">#{index + 1}</span>
                    </td>
                    <td>
                      <span className="font-medium">
                        {formatTime(booking.start_service_datetime || booking.start_time)}
                      </span>
                    </td>
                    <td>
                      <div>
                        <p className="font-medium">{booking.customer_name || "-"}</p>
                        <p className="text-sm text-gray-500">{booking.customer_phone || "-"}</p>
                      </div>
                    </td>
                    <td>
                      <div>
                        <p className="font-medium">{booking.car_no || "-"}</p>
                        <p className="text-sm text-gray-500">
                          {booking.car_size} {booking.car_color && `• ${booking.car_color}`}
                        </p>
                      </div>
                    </td>
                    <td>{booking.service || "-"}</td>
                    {branches.length > 1 && <td>{booking.branch_name || "-"}</td>}
                    <td>{getStatusBadge(booking.processing_status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHome;