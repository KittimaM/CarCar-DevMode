import React, { useEffect, useState, useMemo } from "react";
import {
  GetAllBooking,
  PostUpDateBookingStatus,
  GetAllBranch,
  GetAllCarSize,
  GetAllService,
  PostAddAdminBooking,
} from "./Modules/Api";
import { FaChevronLeft, FaChevronRight, FaFileExcel, FaPlus, FaSearch } from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const AdminSchedule = ({ data }) => {
  const [bookings, setBookings] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [dayBookings, setDayBookings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [carSizes, setCarSizes] = useState([]);
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    car_no: "",
    car_size_id: "",
    car_color: "",
    service: "",
    branch_id: "",
    booking_date: "",
    booking_time: "",
  });
  useEffect(() => {
    fetchBookings();
    fetchFormData();
  }, []);

  const fetchFormData = () => {
    GetAllBranch().then((data) => {
      if (data?.status === "SUCCESS") setBranches(data.msg);
      else if (data?.status === "NO DATA") setBranches([]);
    }).catch((err) => console.error("Branch error:", err));
    
    GetAllCarSize().then((data) => {
      if (data?.status === "SUCCESS") setCarSizes(data.msg);
    }).catch((err) => console.error("CarSize error:", err));
    
    GetAllService().then((data) => {
      if (data?.status === "SUCCESS") setServices(data.msg);
    }).catch((err) => console.error("Service error:", err));
  };

  const fetchBookings = () => {
    setLoading(true);
    GetAllBooking().then((data) => {
      const { status, msg } = data;
      if (status === "SUCCESS") {
        setBookings(msg);
      }
      setLoading(false);
    });
  };

  const filteredBookings = useMemo(() => {
    let filtered = bookings;
    if (selectedBranch) {
      filtered = filtered.filter((b) => String(b.branch_id) === String(selectedBranch));
    }
    return filtered;
  }, [bookings, selectedBranch]);

  useEffect(() => {
    if (!selectedBranch || branches.length === 0) return;
    const stillExists = branches.some((b) => String(b.id) === String(selectedBranch));
    if (!stillExists) setSelectedBranch("");
  }, [branches, selectedBranch]);

  const monthlyStats = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthBookings = filteredBookings.filter((booking) => {
      const bookingDate = booking.start_service_datetime?.split(" ")[0] || booking.booking_date;
      if (!bookingDate) return false;
      const [y, m] = bookingDate.split("-");
      return parseInt(y) === year && parseInt(m) === month + 1;
    });

    const total = monthBookings.length;
    const pending = monthBookings.filter((b) => !b.processing_status || b.processing_status === "pending").length;
    const inProgress = monthBookings.filter((b) => b.processing_status === "in_progress").length;
    const completed = monthBookings.filter((b) => b.processing_status === "completed").length;
    const cancelled = monthBookings.filter((b) => b.processing_status === "cancelled").length;
    const revenue = monthBookings
      .filter((b) => b.processing_status === "completed")
      .reduce((sum, b) => sum + (parseFloat(b.service_price) || 0), 0);

    return { total, pending, inProgress, completed, cancelled, revenue };
  }, [filteredBookings, currentDate]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    return { daysInMonth, startingDay };
  };

  const getBookingsForDate = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    let filtered = filteredBookings.filter((booking) => {
      const bookingDate = booking.start_service_datetime?.split(" ")[0] || booking.booking_date;
      return bookingDate === dateStr;
    });
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.customer_name?.toLowerCase().includes(term) ||
          b.car_no?.toLowerCase().includes(term) ||
          b.service?.toLowerCase().includes(term)
      );
    }
    return filtered;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clickedDate);
    const bookingsForDay = getBookingsForDate(clickedDate);
    setDayBookings(bookingsForDay);
  };

  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleStatusChange = (booking, newStatus) => {
    const payload =
      booking.row_source === "walk_in"
        ? { walk_in_id: booking.id, processing_status: newStatus }
        : { booking_id: booking.id, processing_status: newStatus };
    PostUpDateBookingStatus(payload).then((res) => {
      if (res.status === "SUCCESS") {
        fetchBookings();
        setShowModal(false);
        if (selectedDate) {
          setTimeout(() => {
            const updatedBookings = getBookingsForDate(selectedDate);
            setDayBookings(updatedBookings);
          }, 500);
        }
      }
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const canOpenAddBooking =
    branches.length === 1 ||
    (branches.length > 1 && Boolean(selectedBranch));

  const openAddBookingModal = () => {
    if (branches.length > 1 && !selectedBranch) {
      alert("กรุณาเลือกสาขาจากตัวกรองด้านบนก่อน จึงจะเพิ่มการจองได้");
      return;
    }
    setFormData({
      customer_name: "",
      customer_phone: "",
      car_no: "",
      car_size_id: "",
      car_color: "",
      service: "",
      branch_id:
        branches.length === 1 ? String(branches[0].id) : String(selectedBranch),
      booking_date: "",
      booking_time: "",
    });
    setShowAddForm(true);
  };

  const handleAddBooking = (e) => {
    e.preventDefault();
    if (branches.length > 1 && !formData.branch_id) {
      alert("กรุณาเลือกสาขา");
      return;
    }
    setSubmitting(true);

    const branchIdResolved =
      branches.length === 1
        ? String(branches[0].id)
        : String(formData.branch_id);
    const selectedCarSize = carSizes.find((c) => c.id === parseInt(formData.car_size_id));
    const selectedBranchData = branches.find(
      (b) => String(b.id) === branchIdResolved,
    );
    const startDatetime = `${formData.booking_date} ${formData.booking_time}:00`;
    const endDate = new Date(`${formData.booking_date}T${formData.booking_time}`);
    endDate.setHours(endDate.getHours() + 1);
    const endDatetime = endDate.toISOString().slice(0, 19).replace("T", " ");

    const bookingData = {
      customer_name: formData.customer_name,
      customer_phone: formData.customer_phone,
      car_no: formData.car_no,
      car_size_id: formData.car_size_id,
      car_size: selectedCarSize?.size || "",
      car_color: formData.car_color,
      service: formData.service,
      payment_type_id: null,
      branch_id: branchIdResolved,
      branch_name: selectedBranchData?.name || "",
      start_service_datetime: startDatetime,
      end_service_datetime: endDatetime,
      service_usetime: 60,
      service_price: 0,
    };

    console.log("Sending booking data:", bookingData);
    
    PostAddAdminBooking(bookingData).then((data) => {
      console.log("Booking response:", data);
      setSubmitting(false);
      if (data?.status === "SUCCESS") {
        setShowAddForm(false);
        setFormData({
          customer_name: "",
          customer_phone: "",
          car_no: "",
          car_size_id: "",
          car_color: "",
          service: "",
          branch_id: "",
          booking_date: "",
          booking_time: "",
        });
        fetchBookings();
      } else {
        alert("เกิดข้อผิดพลาด: " + (data?.msg || "ไม่สามารถเพิ่มการจองได้"));
      }
    }).catch((err) => {
      console.error("Booking error:", err);
      setSubmitting(false);
      alert("เกิดข้อผิดพลาด: " + err.message);
    });
  };

  const exportToExcel = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const monthBookings = filteredBookings.filter((booking) => {
      const bookingDate = booking.start_service_datetime?.split(" ")[0] || booking.booking_date;
      if (!bookingDate) return false;
      const [y, m] = bookingDate.split("-");
      return parseInt(y) === year && parseInt(m) === month + 1;
    });

    if (monthBookings.length === 0) {
      alert("ไม่มีข้อมูลการจองในเดือนนี้");
      return;
    }

    const exportData = monthBookings.map((row, index) => ({
      "ลำดับ": index + 1,
      "วันที่": row.start_service_datetime?.split(" ")[0] || row.booking_date || "-",
      "เวลา": formatTime(row.start_service_datetime),
      "ชื่อลูกค้า": row.customer_name || "-",
      "เบอร์โทร": row.customer_phone || "-",
      "ทะเบียนรถ": row.car_no || "-",
      "ขนาดรถ": row.car_size || "-",
      "สีรถ": row.car_color || "-",
      "บริการ": row.service || "-",
      "สาขา": row.branch_name || "-",
      "สถานะ": getStatusLabel(row.processing_status),
      "ราคา": row.service_price || 0,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "การจอง");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, `การจอง_${monthNames[month]}_${year + 543}.xlsx`);
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      pending: "รอดำเนินการ",
      confirmed: "ยืนยันแล้ว",
      in_progress: "กำลังดำเนินการ",
      completed: "เสร็จสิ้น",
      cancelled: "ยกเลิก",
    };
    return statusMap[status] || "รอดำเนินการ";
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { label: "รอดำเนินการ", color: "bg-yellow-100 text-yellow-800" },
      confirmed: { label: "ยืนยันแล้ว", color: "bg-blue-100 text-blue-800" },
      in_progress: { label: "กำลังดำเนินการ", color: "bg-purple-100 text-purple-800" },
      completed: { label: "เสร็จสิ้น", color: "bg-green-100 text-green-800" },
      cancelled: { label: "ยกเลิก", color: "bg-red-100 text-red-800" },
    };
    const statusInfo = statusMap[status] || { label: status || "รอดำเนินการ", color: "bg-gray-100 text-gray-800" };
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

  const { daysInMonth, startingDay } = getDaysInMonth(currentDate);
  const monthNames = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];
  const dayNames = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

  const today = new Date();
  const isToday = (day) => {
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day) => {
    if (!selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      currentDate.getMonth() === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear()
    );
  };

  return (
    <div className="h-full">
      <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-800">ตารางการจอง</h1>
        <div className="flex flex-wrap items-center gap-2">
          {branches.length > 1 && (
            <div className="flex flex-col gap-0.5">
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="select select-bordered select-sm min-w-[180px] h-8 px-3 text-sm"
              >
                <option value="">— เลือกสาขา —</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
              {!selectedBranch && (
                <span className="text-[10px] text-amber-700 leading-tight max-w-[200px]">
                  เลือกสาขาก่อนเพิ่มการจอง
                </span>
              )}
            </div>
          )}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="ค้นหา..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered input-sm pl-9 w-36"
            />
          </div>
          <button onClick={exportToExcel} className="btn btn-sm btn-outline gap-1">
            <FaFileExcel /> Export
          </button>
          <button
            type="button"
            onClick={openAddBookingModal}
            disabled={!canOpenAddBooking}
            title={
              !canOpenAddBooking && branches.length > 1
                ? "กรุณาเลือกสาขาจากตัวกรองด้านบนก่อน"
                : undefined
            }
            className="btn btn-sm btn-primary gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaPlus /> เพิ่มการจอง
          </button>
          <button onClick={fetchBookings} className="btn btn-sm btn-outline">
            รีเฟรช
          </button>
        </div>
      </div>

      {/* Monthly Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white rounded-lg shadow p-3 text-center">
          <p className="text-xs text-gray-500">ทั้งหมด</p>
          <p className="text-xl font-bold text-blue-600">{monthlyStats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-3 text-center">
          <p className="text-xs text-gray-500">รอดำเนินการ</p>
          <p className="text-xl font-bold text-yellow-600">{monthlyStats.pending}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-3 text-center">
          <p className="text-xs text-gray-500">กำลังดำเนินการ</p>
          <p className="text-xl font-bold text-purple-600">{monthlyStats.inProgress}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-3 text-center">
          <p className="text-xs text-gray-500">เสร็จสิ้น</p>
          <p className="text-xl font-bold text-green-600">{monthlyStats.completed}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-3 text-center">
          <p className="text-xs text-gray-500">ยกเลิก</p>
          <p className="text-xl font-bold text-red-600">{monthlyStats.cancelled}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-3 text-center">
          <p className="text-xs text-gray-500">รายได้</p>
          <p className="text-xl font-bold text-green-600">฿{monthlyStats.revenue.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <button onClick={handlePrevMonth} className="btn btn-sm btn-ghost">
              <FaChevronLeft />
            </button>
            <h2 className="text-lg font-semibold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear() + 543}
            </h2>
            <button onClick={handleNextMonth} className="btn btn-sm btn-ghost">
              <FaChevronRight />
            </button>
          </div>

          <div className="flex items-center justify-center gap-4 mb-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <span className="bg-yellow-400 w-3 h-3 rounded-full"></span>
              <span>รอ</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="bg-purple-500 w-3 h-3 rounded-full"></span>
              <span>กำลังทำ</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="bg-green-500 w-3 h-3 rounded-full"></span>
              <span>เสร็จ</span>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <span className="loading loading-spinner loading-md"></span>
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-1">
              {dayNames.map((day) => (
                <div key={day} className="text-center font-medium text-gray-500 py-2 text-sm">
                  {day}
                </div>
              ))}

              {Array.from({ length: startingDay }).map((_, index) => (
                <div key={`empty-${index}`} className="h-20"></div>
              ))}

              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;
                const dateForDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                const dayBookingsList = getBookingsForDate(dateForDay);
                const dayBookingsCount = dayBookingsList.length;
                const pendingCount = dayBookingsList.filter(b => !b.processing_status || b.processing_status === "pending").length;
                const completedCount = dayBookingsList.filter(b => b.processing_status === "completed").length;
                const inProgressCount = dayBookingsList.filter(b => b.processing_status === "in_progress").length;

                return (
                  <div
                    key={day}
                    onClick={() => handleDateClick(day)}
                    className={`h-20 p-1 border rounded-lg cursor-pointer transition-all hover:bg-blue-50 
                      ${isToday(day) ? "border-blue-500 border-2" : "border-gray-200"}
                      ${isSelected(day) ? "bg-blue-100" : "bg-white"}
                    `}
                  >
                    <div className={`text-sm font-medium ${isToday(day) ? "text-blue-600" : "text-gray-700"}`}>
                      {day}
                    </div>
                    {dayBookingsCount > 0 && (
                      <div className="mt-1 space-y-0.5">
                        <div className="flex items-center gap-1">
                          <span className="bg-blue-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                            {dayBookingsCount}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-0.5">
                          {pendingCount > 0 && (
                            <span className="bg-yellow-400 w-2 h-2 rounded-full" title={`รอ ${pendingCount}`}></span>
                          )}
                          {inProgressCount > 0 && (
                            <span className="bg-purple-500 w-2 h-2 rounded-full" title={`กำลังทำ ${inProgressCount}`}></span>
                          )}
                          {completedCount > 0 && (
                            <span className="bg-green-500 w-2 h-2 rounded-full" title={`เสร็จ ${completedCount}`}></span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Day Details */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">
            {selectedDate
              ? `${selectedDate.getDate()} ${monthNames[selectedDate.getMonth()]} ${selectedDate.getFullYear() + 543}`
              : "เลือกวันที่เพื่อดูคิว"}
          </h3>

          {!selectedDate ? (
            <div className="text-center text-gray-500 py-8">
              คลิกที่วันในปฏิทินเพื่อดูรายละเอียด
            </div>
          ) : dayBookings.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              ไม่มีการจองในวันนี้
            </div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {dayBookings.map((booking, index) => (
                <div
                  key={`${booking.row_source || "booking"}-${booking.id}`}
                  onClick={() => handleBookingClick(booking)}
                  className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-blue-600">#{index + 1}</span>
                    {getStatusBadge(booking.processing_status)}
                  </div>
                  <div className="text-sm space-y-1">
                    <p><span className="text-gray-500">เวลา:</span> {formatTime(booking.start_service_datetime)}</p>
                    <p><span className="text-gray-500">ลูกค้า:</span> {booking.customer_name || "-"}</p>
                    <p><span className="text-gray-500">ทะเบียน:</span> {booking.car_no || "-"}</p>
                    <p><span className="text-gray-500">บริการ:</span> {booking.service || "-"}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      </div>

      {/* Add Booking Modal */}
      {showAddForm && (
        <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-full bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
            <div className="px-6 py-4 border-b bg-blue-600 rounded-t-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">เพิ่มการจองใหม่</h2>
                <button onClick={() => setShowAddForm(false)} className="btn btn-sm btn-circle btn-ghost text-white hover:bg-blue-700">
                  ✕
                </button>
              </div>
            </div>
            <form onSubmit={handleAddBooking} className="p-6 space-y-5">
              {/* สาขา — ตัวเลือกแรก */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">1</span>
                  สาขา
                </h3>
                {branches.length === 1 ? (
                  <p className="text-sm font-semibold text-gray-800">{branches[0].name}</p>
                ) : (
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {branches.find((b) => String(b.id) === String(formData.branch_id))?.name ||
                        "—"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      สาขามาจากที่เลือกไว้ในตัวกรองด้านบน
                    </p>
                  </div>
                )}
              </div>

              {/* วันที่และเวลา */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">2</span>
                  วันที่และเวลา
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">วันที่ *</span>
                    </label>
                    <input
                      type="date"
                      name="booking_date"
                      value={formData.booking_date}
                      onChange={handleInputChange}
                      required
                      className="input input-bordered w-full"
                    />
                  </div>
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">เวลา *</span>
                    </label>
                    <input
                      type="time"
                      name="booking_time"
                      value={formData.booking_time}
                      onChange={handleInputChange}
                      required
                      className="input input-bordered w-full"
                    />
                  </div>
                </div>
              </div>

              {/* ข้อมูลลูกค้า */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">3</span>
                  ข้อมูลลูกค้า
                </h3>
                <div className="grid grid-cols-2 gap-4">
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

              {/* ข้อมูลรถ */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">4</span>
                  ข้อมูลรถ
                </h3>
                <div className="grid grid-cols-3 gap-4">
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
                        <option key={cs.id} value={cs.id}>{cs.size}</option>
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

              {/* บริการ */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs">5</span>
                  บริการ
                </h3>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">บริการ *</span>
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    required
                    className="select select-bordered w-full"
                  >
                    <option value="">เลือกบริการ</option>
                    {services.map((svc) => (
                      <option key={svc.id} value={svc.name}>{svc.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ปุ่มกด */}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-outline flex-1 h-12">
                  ยกเลิก
                </button>
                <button type="submit" disabled={submitting} className="btn btn-primary flex-1 h-12">
                  {submitting ? <span className="loading loading-spinner"></span> : "เพิ่มการจอง"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Booking Detail Modal */}
      {showModal && selectedBooking && (
        <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-full bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="px-4 py-3 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold">รายละเอียดการจอง</h2>
              <button onClick={() => setShowModal(false)} className="btn btn-sm btn-ghost">
                ✕
              </button>
            </div>
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500">ลูกค้า</p>
                  <p className="font-medium">{selectedBooking.customer_name || "-"}</p>
                </div>
                <div>
                  <p className="text-gray-500">เบอร์โทร</p>
                  <p className="font-medium">{selectedBooking.customer_phone || "-"}</p>
                </div>
                <div>
                  <p className="text-gray-500">ทะเบียนรถ</p>
                  <p className="font-medium">{selectedBooking.car_no || "-"}</p>
                </div>
                <div>
                  <p className="text-gray-500">ขนาด/สี</p>
                  <p className="font-medium">{selectedBooking.car_size || "-"} {selectedBooking.car_color && `/ ${selectedBooking.car_color}`}</p>
                </div>
                <div>
                  <p className="text-gray-500">บริการ</p>
                  <p className="font-medium">{selectedBooking.service || "-"}</p>
                </div>
                <div>
                  <p className="text-gray-500">เวลา</p>
                  <p className="font-medium">{formatTime(selectedBooking.start_service_datetime)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500">สถานะปัจจุบัน</p>
                  <div className="mt-1">{getStatusBadge(selectedBooking.processing_status)}</div>
                </div>
              </div>

              <div className="border-t pt-3">
                <p className="text-sm text-gray-500 mb-2">เปลี่ยนสถานะ:</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleStatusChange(selectedBooking, "pending")}
                    className="btn btn-xs bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200"
                  >
                    รอดำเนินการ
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedBooking, "confirmed")}
                    className="btn btn-xs bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200"
                  >
                    ยืนยัน
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedBooking, "in_progress")}
                    className="btn btn-xs bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-200"
                  >
                    กำลังดำเนินการ
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedBooking, "completed")}
                    className="btn btn-xs bg-green-100 text-green-800 border-green-300 hover:bg-green-200"
                  >
                    เสร็จสิ้น
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedBooking, "cancelled")}
                    className="btn btn-xs bg-red-100 text-red-800 border-red-300 hover:bg-red-200"
                  >
                    ยกเลิก
                  </button>
                </div>
              </div>
            </div>
            <div className="px-4 py-3 border-t">
              <button onClick={() => setShowModal(false)} className="btn btn-sm btn-outline w-full">
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSchedule;
