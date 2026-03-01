import React, { useEffect, useState } from "react";
import {
  GetAllBooking,
  GetAllCarSize,
  GetAllService,
  GetAllPaymentType,
  GetAllBranch,
  PostAddAdminBooking,
} from "./Modules/Api";

const AdminHome = () => {
  const [bookings, setBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [carSizes, setCarSizes] = useState([]);
  const [services, setServices] = useState([]);
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    car_no: "",
    car_size_id: "",
    car_color: "",
    service: "",
    payment_type_id: "",
    branch_id: "",
  });

  useEffect(() => {
    fetchTodayBookings();
    fetchFormData();
  }, []);

  useEffect(() => {
    filterBookingsByBranch();
  }, [selectedBranch, allBookings]);

  const filterBookingsByBranch = () => {
    if (!selectedBranch) {
      setBookings(allBookings);
    } else {
      const filtered = allBookings.filter(
        (b) => String(b.branch_id) === String(selectedBranch)
      );
      setBookings(filtered);
    }
  };

  const fetchFormData = () => {
    GetAllCarSize().then((data) => {
      if (data.status === "SUCCESS") setCarSizes(data.msg);
    });
    GetAllService().then((data) => {
      if (data.status === "SUCCESS") setServices(data.msg);
    });
    GetAllPaymentType().then((data) => {
      if (data.status === "SUCCESS") setPaymentTypes(data.msg);
    });
    GetAllBranch().then((data) => {
      if (data.status === "SUCCESS") setBranches(data.msg);
    });
  };

  const fetchTodayBookings = () => {
    setLoading(true);
    GetAllBooking().then((data) => {
      const { status, msg } = data;
      if (status === "SUCCESS") {
        const today = new Date().toISOString().split("T")[0];
        const todayBookings = msg.filter((booking) => {
          const bookingDate = booking.start_service_datetime?.split(" ")[0] || booking.booking_date;
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
    const statusInfo = statusMap[status] || { label: status || "ไม่ทราบ", color: "bg-gray-100 text-gray-800" };
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    const selectedCarSize = carSizes.find(
      (c) => c.id === parseInt(formData.car_size_id)
    );
    const now = new Date();
    const startDatetime = now.toISOString().slice(0, 19).replace("T", " ");
    const endDate = new Date(now.getTime() + 60 * 60 * 1000);
    const endDatetime = endDate.toISOString().slice(0, 19).replace("T", " ");

    const selectedBranchData = branches.find(
      (b) => b.id === parseInt(formData.branch_id)
    );

    const bookingData = {
      customer_name: formData.customer_name,
      customer_phone: formData.customer_phone,
      car_no: formData.car_no,
      car_size_id: formData.car_size_id,
      car_size: selectedCarSize?.name || "",
      car_color: formData.car_color,
      service: formData.service,
      payment_type_id: formData.payment_type_id,
      branch_id: formData.branch_id,
      branch_name: selectedBranchData?.name || "",
      start_service_datetime: startDatetime,
      end_service_datetime: endDatetime,
      service_usetime: 60,
      service_price: 0,
    };

    PostAddAdminBooking(bookingData).then((data) => {
      setSubmitting(false);
      if (data.status === "SUCCESS") {
        setShowForm(false);
        setFormData({
          customer_name: "",
          customer_phone: "",
          car_no: "",
          car_size_id: "",
          car_color: "",
          service: "",
          payment_type_id: "",
          branch_id: "",
        });
        fetchTodayBookings();
      } else {
        alert("เกิดข้อผิดพลาด: " + (data.msg || "ไม่สามารถเพิ่มการจองได้"));
      }
    });
  };

  return (
    <div className="h-full">
      <div className="flex flex-col sm:flex-row  sm:justify-between  gap-4 mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-800">หน้าหลัก</h1>
          {branches.length > 1 && (
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="select select-bordered min-w-[160px] h-10 px-3 text-sm"
            >
              <option value="">ทุกสาขา</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="flex gap-2 items-center ">
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-sm btn-primary"
          >
            + ลูกค้า Walk-in
          </button>
          <button
            onClick={fetchTodayBookings}
            className="btn btn-sm btn-outline"
          >
            รีเฟรช
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center ">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold">เพิ่มลูกค้า Walk-in</h2>
              <button
                onClick={() => setShowForm(false)}
                className="btn btn-sm btn-ghost"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">ชื่อลูกค้า *</span>
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
                  <span className="label-text">เบอร์โทรศัพท์</span>
                </label>
                <input
                  type="tel"
                  name="customer_phone"
                  value={formData.customer_phone}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  placeholder="กรอกเบอร์โทรศัพท์"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">ทะเบียนรถ *</span>
                </label>
                <input
                  type="text"
                  name="car_no"
                  value={formData.car_no}
                  onChange={handleInputChange}
                  required
                  className="input input-bordered w-full"
                  placeholder="กรอกทะเบียนรถ"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">ขนาดรถ *</span>
                  </label>
                  <select
                    name="car_size_id"
                    value={formData.car_size_id}
                    onChange={handleInputChange}
                    required
                    className="select select-bordered w-full"
                  >
                    <option value="">เลือกขนาดรถ</option>
                    {carSizes.map((size) => (
                      <option key={size.id} value={size.id}>
                        {size.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">สีรถ</span>
                  </label>
                  <input
                    type="text"
                    name="car_color"
                    value={formData.car_color}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    placeholder="เช่น ขาว"
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">บริการ *</span>
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
                    <option key={svc.id} value={svc.name}>
                      {svc.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">ประเภทการชำระเงิน *</span>
                </label>
                <select
                  name="payment_type_id"
                  value={formData.payment_type_id}
                  onChange={handleInputChange}
                  required
                  className="select select-bordered w-full"
                >
                  <option value="">เลือกประเภทการชำระเงิน</option>
                  {paymentTypes.map((pt) => (
                    <option key={pt.id} value={pt.id}>
                      {pt.name}
                    </option>
                  ))}
                </select>
              </div>

              {branches.length > 1 && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">สาขา *</span>
                  </label>
                  <select
                    name="branch_id"
                    value={formData.branch_id}
                    onChange={handleInputChange}
                    required
                    className="select select-bordered w-full"
                  >
                    <option value="">เลือกสาขา</option>
                    {branches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn btn-outline flex-1"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary flex-1"
                >
                  {submitting ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    "เพิ่มคิว"
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
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td>
                      <span className="font-bold text-lg text-blue-600">
                        #{index + 1}
                      </span>
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
                    {branches.length > 1 && (
                      <td>{booking.branch_name || "-"}</td>
                    )}
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