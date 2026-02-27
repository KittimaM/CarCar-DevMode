import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  GetCustomerCar,
  GetBookingBranches,
  GetBookingChannels,
  GetChannelOpenDays,
  GetBookingServiceRates,
  PostBookingAvailableSlots,
  PostAddCustomerBooking,
  GetAllCustomerBooking,
  DeleteCustomerBooking,
  PostAddCustomerCar,
  GetAllProvince,
  GetAllCarSize,
  GetAvailableCarSize,
} from "../Modules/Api";

const STEP_LABELS = [
  "กรุณาเลือกสาขา",
  "กรุณาเลือกรถ",
  "กรุณาเลือกบริการ",
  "กรุณาเลือกวันที่",
  "กรุณาเลือกเวลา",
  "กรุณายืนยันการจอง",
];
const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// const CustomerBooking = () => {
//   const [step, setStep] = useState(1);
//   const [branches, setBranches] = useState([]);
//   const [channels, setChannels] = useState([]);
//   const [cars, setCars] = useState([]);
//   const [serviceRates, setServiceRates] = useState([]);
//   const [slots, setSlots] = useState([]);
//   const [bookedSlots, setBookedSlots] = useState([]);
//   const [openDays, setOpenDays] = useState([]);
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState(null);
//   const [bookingSuccess, setBookingSuccess] = useState(false);
//   const [lastBookingNos, setLastBookingNos] = useState("");
//   const [showAddCar, setShowAddCar] = useState(false);
//   const [provinces, setProvinces] = useState([]);
//   const [carSizes, setCarSizes] = useState([]);
//   const [addCarForm, setAddCarForm] = useState({
//     plate_no: "",
//     province_id: "",
//     brand: "",
//     model: "",
//     size_id: "",
//     color: "",
//   });

//   const [form, setForm] = useState({
//     branch_id: "",
//     branch_name: "",
//     booking_date: "",
//     customer_car_id: "",
//     car_label: "",
//     car_size_id: "",
//     selected_services: [], // [{ id, service_name, price, duration_minute }]
//     channel_id: "",
//     channel_name: "",
//     start_time: "",
//     end_time: "",
//   });

//   useEffect(() => {
//     GetBookingBranches().then(({ status, msg }) => {
//       if (status === "SUCCESS") setBranches(Array.isArray(msg) ? msg : []);
//     });
//     loadCars();
//     loadBookings();
//   }, []);

//   useEffect(() => {
//     if (showAddCar) {
//       GetAllProvince().then(({ status, msg }) => {
//         if (status === "SUCCESS") setProvinces(Array.isArray(msg) ? msg : []);
//       });
//       GetAllCarSize().then(({ status, msg }) => {
//         if (status === "SUCCESS") setCarSizes(Array.isArray(msg) ? msg : []);
//       });
//     }
//   }, [showAddCar]);

//   useEffect(() => {
//     if (step === 5 && form.branch_id && form.booking_date && form.selected_services.length > 0) {
//       loadSlots();
//     }
//   }, [step, form.branch_id, form.booking_date, form.selected_services.length]);

//   useEffect(() => {
//     if (step === 3 && form.branch_id && form.car_size_id) {
//       loadServiceRatesForBranchAndCar(form.branch_id, form.car_size_id);
//     }
//   }, [step, form.branch_id, form.car_size_id]);

//   useEffect(() => {
//     if (step === 4 && form.branch_id && form.selected_services.length > 0) {
//       GetChannelOpenDays(form.branch_id, form.selected_services.map((s) => s.id)).then((res) => {
//         const days = res?.status === "SUCCESS" && Array.isArray(res.msg) ? res.msg : [];
//         setOpenDays(days);
//       });
//     } else {
//       setOpenDays([]);
//     }
//   }, [step, form.branch_id, (form.selected_services || []).map((s) => s.id).join(",")]);

//   const loadBookings = () => {
//     GetAllCustomerBooking().then((res) => {
//       if (!res) return;
//       const { status, msg } = res;
//       if (status === "SUCCESS") setBookings(Array.isArray(msg) ? msg : []);
//       else if (status === "NO DATA") setBookings([]);
//     });
//   };

//   const loadCars = () => {
//     GetCustomerCar().then(({ status, msg }) => {
//       if (status === "SUCCESS") setCars(Array.isArray(msg) ? msg : []);
//     });
//   };

//   const loadServiceRatesForBranchAndCar = (branchId, carSizeId) => {
//     if (!branchId || !carSizeId) {
//       setServiceRates([]);
//       return;
//     }
//     setLoading(true);
//     GetBookingServiceRates(carSizeId, branchId).then(({ status, msg }) => {
//       setLoading(false);
//       if (status === "SUCCESS") setServiceRates(Array.isArray(msg) ? msg : []);
//       else setServiceRates([]);
//     });
//   };

//   const handleBranchChange = (e) => {
//     const id = e.target.value;
//     const b = branches.find((x) => x.id === parseInt(id));
//     setForm((prev) => ({
//       ...prev,
//       branch_id: id,
//       branch_name: b?.name || "",
//       selected_services: [],
//     }));
//     setChannels([]);
//     setServiceRates([]);
//     if (id) {
//       setLoading(true);
//       GetBookingChannels(id).then(({ status, msg }) => {
//         setLoading(false);
//         if (status === "SUCCESS") setChannels(msg);
//       });
//       loadServiceRatesForBranchAndCar(id, form.car_size_id);
//     }
//   };

//   const handleAddCar = (e) => {
//     e.preventDefault();
//     if (
//       !addCarForm.plate_no ||
//       !addCarForm.province_id ||
//       !addCarForm.brand ||
//       !addCarForm.size_id ||
//       !addCarForm.color
//     ) {
//       setMessage("กรุณากรอกข้อมูลให้ครบ");
//       return;
//     }
//     setLoading(true);
//     setMessage(null);
//     PostAddCustomerCar(addCarForm).then(({ status, msg }) => {
//       setLoading(false);
//       if (status === "SUCCESS") {
//         setShowAddCar(false);
//         setAddCarForm({
//           plate_no: "",
//           province_id: "",
//           brand: "",
//           model: "",
//           size_id: "",
//           color: "",
//         });
//         loadCars();
//         const newId = String(msg);
//         const carLabel =
//           `${addCarForm.plate_no} ${addCarForm.brand} ${addCarForm.model || ""}`.trim();
//         setForm((prev) => ({
//           ...prev,
//           customer_car_id: newId,
//           car_label: carLabel,
//           car_size_id: addCarForm.size_id,
//           selected_services: [],
//         }));
//         setMessage("เพิ่มรถสำเร็จ รถที่เพิ่มถูกเลือกให้แล้ว");
//         if (addCarForm.size_id && form.branch_id) {
//           loadServiceRatesForBranchAndCar(form.branch_id, addCarForm.size_id);
//         }
//       } else {
//         setMessage(msg?.message || msg || "ไม่สามารถเพิ่มรถได้");
//       }
//     });
//   };

//   const handleCarChange = (e) => {
//     const id = e.target.value;
//     const c = cars.find((x) => x.id === parseInt(id));
//     setForm((prev) => ({
//       ...prev,
//       customer_car_id: id,
//       car_label: c
//         ? `${c.plate_no} ${c.brand || ""} ${c.model || ""}`.trim()
//         : "",
//       car_size_id: c?.size_id || "",
//       selected_services: [],
//     }));
//     setServiceRates([]);
//     if (c?.size_id && form.branch_id) {
//       loadServiceRatesForBranchAndCar(form.branch_id, c.size_id);
//     }
//   };

//   const toggleService = (s) => {
//     setForm((prev) => {
//       const exists = prev.selected_services.find((x) => x.id === s.id);
//       const next = exists
//         ? prev.selected_services.filter((x) => x.id !== s.id)
//         : [...prev.selected_services, { id: s.id, service_name: s.service_name, price: s.price, duration_minute: s.duration_minute }];
//       return { ...prev, selected_services: next, channel_id: "", channel_name: "", start_time: "", end_time: "" };
//     });
//     setSlots([]);
//     setBookedSlots([]);
//   };

//   const loadSlots = () => {
//     if (!form.branch_id || !form.booking_date || form.selected_services.length === 0) {
//       setMessage("กรุณาเลือกสาขา วันที่ และบริการอย่างน้อย 1 รายการ");
//       return;
//     }
//     setLoading(true);
//     setMessage(null);
//     PostBookingAvailableSlots({
//       branch_id: parseInt(form.branch_id),
//       booking_date: form.booking_date,
//       service_car_size_ids: form.selected_services.map((s) => s.id),
//     }).then(({ status, msg, booked }) => {
//       setLoading(false);
//       if (status === "SUCCESS") {
//         const raw = msg || [];
//         const byChannel = [...raw].sort(
//           (a, b) => (b.channel_id - a.channel_id) || String(a.start_time).localeCompare(String(b.start_time))
//         );
//         const seen = new Set();
//         const merged = byChannel.filter((s) => {
//           const key = `${s.start_time}-${s.end_time}`;
//           if (seen.has(key)) return false;
//           seen.add(key);
//           return true;
//         });
//         merged.sort((a, b) => String(a.start_time).localeCompare(String(b.start_time)));
//         setSlots(merged);

//         setBookedSlots(booked || []);
//       } else {
//         setMessage(msg?.message || "ไม่พบช่วงเวลาว่าง");
//       }
//     });
//   };

//   const handleSlotSelect = (slot) => {
//     setForm((prev) => ({
//       ...prev,
//       channel_id: slot.channel_id,
//       channel_name: slot.channel_name,
//       start_time: slot.start_time,
//       end_time: slot.end_time,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage(null);
//     setLoading(true);
//     const services = form.selected_services;
//     let timeStart = form.start_time;
//     const bookingNos = [];
//     for (let i = 0; i < services.length; i++) {
//       const s = services[i];
//       const dur = parseInt(s.duration_minute) || 0;
//       const [h, m] = timeStart.split(":").map(Number);
//       const endDate = new Date(1970, 0, 1, h, m + dur, 0);
//       const endTime = `${String(endDate.getHours()).padStart(2, "0")}:${String(endDate.getMinutes()).padStart(2, "0")}`;
//       const data = await PostAddCustomerBooking({
//         customer_car_id: parseInt(form.customer_car_id),
//         channel_id: parseInt(form.channel_id),
//         service_car_size_id: parseInt(s.id),
//         booking_date: form.booking_date,
//         start_time: timeStart,
//         end_time: endTime,
//         price_snapshot: parseFloat(s.price),
//         duration_snapshot: dur,
//       });
//       if (data && data.status === "SUCCESS") {
//         bookingNos.push(data.msg?.booking_no || data.msg);
//       } else {
//         setLoading(false);
//         setMessage(data?.msg || "เกิดข้อผิดพลาด");
//         return;
//       }
//       timeStart = endTime;
//     }
//     setLoading(false);
//     setMessage(null);
//     setLastBookingNos(bookingNos.join(", "));
//     setBookingSuccess(true);
//     loadBookings();
//     setForm({
//       branch_id: "",
//       branch_name: "",
//       booking_date: "",
//       customer_car_id: "",
//       car_label: "",
//       car_size_id: "",
//       selected_services: [],
//       channel_id: "",
//       channel_name: "",
//       start_time: "",
//       end_time: "",
//     });
//   };

//   const handleCancelBooking = (bookingId) => {
//     if (!window.confirm("ยืนยันยกเลิกการจอง?")) return;
//     setBookings((prev) => prev.filter((b) => b.id !== bookingId));
//     DeleteCustomerBooking({ booking_id: bookingId }).then((res) => {
//       if (res?.status === "SUCCESS") {
//         if (form.branch_id && form.booking_date && form.selected_services.length > 0) loadSlots();
//       } else {
//         loadBookings();
//       }
//     });
//   };

//   const canButtonProceed = () => {
//     if (step === 1) return !!form.branch_id;
//     if (step === 2) return !!form.customer_car_id;
//     if (step === 3) return form.selected_services.length > 0;
//     if (step === 4) return !!form.booking_date;
//     if (step === 5) return !!form.channel_id && !!form.start_time;
//     return false;
//   };

//   const formatDate = (d) => (d ? new Date(d).toLocaleDateString("th-TH") : "");
//   const tomorrow = new Date();
//   tomorrow.setDate(tomorrow.getDate() + 1);
//   const maxDate = new Date(tomorrow);
//   maxDate.setMonth(maxDate.getMonth() + 2);

//   return (
//     <div className="w-full max-w-2xl mx-auto space-y-5 sm:space-y-6 px-3 sm:px-0 pb-8">
//       {/* Header */}
//       <div className="text-center sm:text-left">
//         <h1 className="text-2xl sm:text-3xl font-bold text-base-content">จองล้างรถ</h1>
//         <p className="text-base-content/70 text-sm sm:text-base mt-1">เลือกสาขา วันที่ บริการ และช่วงเวลาที่ต้องการ</p>
//       </div>

//       {bookingSuccess ? (
//         <div className="card bg-base-100 shadow-md border border-base-200 rounded-2xl p-6 sm:p-8 text-center">
//           <div className="text-success text-lg font-medium mb-2">✓ จองสำเร็จ</div>
//           <p className="text-base-content/70 mb-4">เลขที่จอง: {lastBookingNos}</p>
//           <p className="text-sm text-base-content/60 mb-4">ต้องการจองอีกครั้งหรือไม่?</p>
//           <button
//             type="button"
//             className="btn btn-primary"
//             onClick={() => { setBookingSuccess(false); setStep(1); }}
//           >
//             จองอีกครั้ง
//           </button>
//         </div>
//       ) : (
//         <>
//       {/* Step indicator */}
//       <div className="flex items-center justify-center gap-1 sm:gap-2 overflow-x-auto pb-1">
//         {STEP_LABELS.map((label, i) => (
//           <div key={i} className="flex items-center shrink-0">
//             <div
//               className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
//                 i + 1 === step ? "bg-primary text-primary-content" :
//                 i + 1 < step ? "bg-primary/20 text-primary" :
//                 "bg-base-300 text-base-content/50"
//               }`}
//             >
//               {i + 1 < step ? "✓" : i + 1}
//             </div>
//             <span className={`hidden sm:inline ml-1 text-sm ${i + 1 <= step ? "text-base-content" : "text-base-content/50"}`}>
//               {label}
//             </span>
//             {i < STEP_LABELS.length - 1 && (
//               <div className={`w-4 sm:w-8 h-0.5 mx-0.5 sm:mx-1 ${i + 1 < step ? "bg-primary" : "bg-base-300"}`} />
//             )}
//           </div>
//         ))}
//       </div>

//       {message && (
//         <div
//           className={`alert shadow-sm ${String(message || "").includes("สำเร็จ") ? "alert-success" : "alert-warning"}`}
//           role="alert"
//         >
//           <span>{typeof message === "string" ? message : (message?.sqlMessage || message?.message) || "เกิดข้อผิดพลาด"}</span>
//         </div>
//       )}

//       <div className="card bg-base-100 shadow-md border border-base-200/60 rounded-2xl overflow-visible">
//         <div className="card-body p-5 sm:p-6 min-w-0">
//         {step === 1 && (
//           <div className="space-y-3">
//             <h3 className="font-semibold text-base flex items-center gap-2">
//               <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">1</span>
//               เลือกสาขา
//             </h3>
//             <select
//               className="select select-bordered w-full select-md"
//               value={form.branch_id}
//               onChange={handleBranchChange}
//             >
//               <option value="">-- เลือกสาขา --</option>
//               {branches.map((b) => (
//                 <option key={b.id} value={b.id}>
//                   {b.name} {b.address ? `- ${b.address}` : ""}
//                 </option>
//               ))}
//             </select>
//           </div>
//         )}

//         {step === 2 && (
//           <div className="space-y-4">
//             <h3 className="font-semibold text-base flex items-center gap-2">
//               <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">2</span>
//               เลือกรถ
//             </h3>
//             <div className="flex flex-col sm:flex-row gap-2">
//               {cars.length > 0 && (
//               <select
//                 className="select select-bordered w-full sm:flex-1 select-md"
//                 value={form.customer_car_id}
//                   onChange={handleCarChange}
//                 >
//                   <option value="">-- เลือกรถที่มีอยู่ --</option>
//                   {cars.map((c) => (
//                     <option key={c.id} value={c.id}>
//                       {c.plate_no} | {c.brand || ""} {c.model || ""}
//                     </option>
//                   ))}
//                 </select>
//               )}
//               <button
//                 type="button"
//                 className="btn btn-outline btn-sm w-full sm:w-auto"
//                 onClick={() => setShowAddCar((v) => !v)}
//               >
//                 {showAddCar ? "ยกเลิก" : "+ เพิ่มรถใหม่"}
//               </button>
//             </div>
//             {cars.length === 0 && !showAddCar && (
//               <p className="text-base-content/70">
//                 ยังไม่มีรถในระบบ กด &quot;+ เพิ่มรถใหม่&quot; เพื่อเพิ่มรถ
//               </p>
//             )}
//             {showAddCar && (
//               <form
//                 onSubmit={handleAddCar}
//                 className="bg-base-200/50 rounded-xl p-4 sm:p-5 border border-base-300 space-y-3"
//               >
//                 <h4 className="font-medium text-base flex items-center gap-2">🚗 เพิ่มรถใหม่</h4>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                   <label className="form-control">
//                     <span className="label-text">ทะเบียนรถ</span>
//                     <input
//                       type="text"
//                       className="input input-bordered input-sm"
//                       value={addCarForm.plate_no}
//                       onChange={(e) => {
//                         const v = e.target.value.replace(
//                           /[^\u0E00-\u0E7F0-9]/g,
//                           "",
//                         );
//                         setAddCarForm((p) => ({ ...p, plate_no: v }));
//                       }}
//                       required
//                     />
//                   </label>
//                   <label className="form-control">
//                     <span className="label-text">จังหวัด</span>
//                     <select
//                       className="select select-bordered select-sm"
//                       value={addCarForm.province_id}
//                       onChange={(e) =>
//                         setAddCarForm((p) => ({
//                           ...p,
//                           province_id: e.target.value,
//                         }))
//                       }
//                       required
//                     >
//                       <option value="">-- เลือก --</option>
//                       {provinces.map((p) => (
//                         <option key={p.id} value={p.id}>
//                           {p.province}
//                         </option>
//                       ))}
//                     </select>
//                   </label>
//                   <label className="form-control">
//                     <span className="label-text">ยี่ห้อ</span>
//                     <input
//                       type="text"
//                       className="input input-bordered input-sm"
//                       value={addCarForm.brand}
//                       onChange={(e) =>
//                         setAddCarForm((p) => ({ ...p, brand: e.target.value }))
//                       }
//                       required
//                     />
//                   </label>
//                   <label className="form-control">
//                     <span className="label-text">รุ่น (ถ้ามี)</span>
//                     <input
//                       type="text"
//                       className="input input-bordered input-sm"
//                       value={addCarForm.model}
//                       onChange={(e) =>
//                         setAddCarForm((p) => ({ ...p, model: e.target.value }))
//                       }
//                     />
//                   </label>
//                   <label className="form-control">
//                     <span className="label-text">ขนาดรถ</span>
//                     <select
//                       className="select select-bordered select-sm"
//                       value={addCarForm.size_id}
//                       onChange={(e) =>
//                         setAddCarForm((p) => ({
//                           ...p,
//                           size_id: e.target.value,
//                         }))
//                       }
//                       required
//                     >
//                       <option value="">-- เลือก --</option>
//                       {carSizes.map((s) => (
//                         <option key={s.id} value={s.id}>
//                           {s.size}
//                         </option>
//                       ))}
//                     </select>
//                   </label>
//                   <label className="form-control">
//                     <span className="label-text">สี</span>
//                     <input
//                       type="text"
//                       className="input input-bordered input-sm"
//                       value={addCarForm.color}
//                       onChange={(e) =>
//                         setAddCarForm((p) => ({ ...p, color: e.target.value }))
//                       }
//                       required
//                     />
//                   </label>
//                 </div>
//                 <div className="flex gap-2">
//                   <button
//                     type="submit"
//                     className="btn btn-primary btn-sm"
//                     disabled={loading}
//                   >
//                     {loading ? "กำลังบันทึก..." : "เพิ่มรถ"}
//                   </button>
//                   <button
//                     type="button"
//                     className="btn btn-ghost btn-sm"
//                     onClick={() => setShowAddCar(false)}
//                   >
//                     ยกเลิก
//                   </button>
//                 </div>
//               </form>
//             )}
//           </div>
//         )}

//         {step === 3 && (
//           <div className="space-y-3">
//             <h3 className="font-semibold text-base flex items-center gap-2">
//               <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">3</span>
//               เลือกบริการ (เลือกได้หลายรายการ)
//             </h3>
//             {serviceRates.length === 0 && !form.customer_car_id && (
//               <p className="text-base-content/70">กรุณาเลือกรถก่อน</p>
//             )}
//             {serviceRates.length === 0 && form.customer_car_id && !loading && (
//               <p className="text-base-content/70">สาขานี้ยังไม่มีบริการสำหรับขนาดรถนี้</p>
//             )}
//             <div className="grid gap-2">
//               {serviceRates.map((s) => {
//                 const isSelected = form.selected_services.some((x) => x.id === s.id);
//                 return (
//                   <button
//                     key={s.id}
//                     type="button"
//                     onClick={() => toggleService(s)}
//                     className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 p-4 rounded-xl border-2 text-left transition-all ${
//                       isSelected
//                         ? "border-primary bg-primary/5"
//                         : "border-base-300 hover:border-base-content/20 hover:bg-base-200/50"
//                     }`}
//                   >
//                     <span className="font-medium flex items-center gap-2">
//                       {isSelected && <span className="text-primary">✓</span>}
//                       {s.service_name}
//                     </span>
//                     <span className="text-sm text-base-content/70">
//                       {s.duration_minute} นาที · ฿{Number(s.price).toLocaleString()}
//                     </span>
//                   </button>
//                 );
//               })}
//             </div>
//             {form.selected_services.length > 0 && (
//               <p className="text-sm text-base-content/70">
//                 เลือกแล้ว {form.selected_services.length} รายการ · รวม {form.selected_services.reduce((a, s) => a + (parseInt(s.duration_minute) || 0), 0)} นาที · ฿{form.selected_services.reduce((a, s) => a + (parseFloat(s.price) || 0), 0).toLocaleString()}
//               </p>
//             )}
//           </div>
//         )}

//         {step === 4 && (
//           <div className="space-y-3">
//             <h3 className="font-semibold text-base flex items-center gap-2">
//               <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">4</span>
//               เลือกวันที่
//             </h3>
//             {openDays.length > 0 && (
//               <p className="text-xs text-base-content/60">เฉพาะวันที่สาขาเปิด (วันที่ไม่เปิดจะถูกปิด)</p>
//             )}
//             <p className="text-xs text-base-content/60">เลือกได้ภายใน 2 เดือนข้างหน้า</p>
//             <DatePicker
//               selected={form.booking_date ? new Date(form.booking_date + "T12:00:00") : null}
//               onChange={(date) => {
//                 setMessage(null);
//                 setForm((p) => ({
//                   ...p,
//                   booking_date: date ? date.toISOString().slice(0, 10) : "",
//                 }));
//               }}
//               minDate={tomorrow}
//               maxDate={maxDate}
//               filterDate={(date) =>
//                 openDays.length === 0 || openDays.includes(DAY_NAMES[date.getDay()])
//               }
//               dateFormat="dd/MM/yyyy"
//               placeholderText="เลือกวันที่"
//               className="input input-bordered w-full input-md"
//               isClearable
//               inline
//             />
//           </div>
//         )}

//         {step === 5 && (
//           <div className="space-y-4">
//             <h3 className="font-semibold text-base flex items-center gap-2">
//               <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">5</span>
//               เลือกช่วงเวลา
//             </h3>
//             {loading && <p className="text-base-content/70">กำลังโหลด...</p>}
//             {!loading && (slots.length > 0 || (slots.length === 0 && bookedSlots.length > 0)) && (
//               <div className="space-y-4">
//                 {slots.length === 0 && bookedSlots.length > 0 && (
//                   <div>
//                     <p className="text-xs font-medium text-base-content/60 mb-2">เวลาที่จองแล้ว (เต็มทุก channel)</p>
//                     <div className="flex flex-wrap gap-2">
//                       {bookedSlots.map((b, i) => (
//                         <span key={i} className="badge badge-ghost bg-base-200">
//                           {b.start_time} - {b.end_time}
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//                 {slots.length > 0 && (
//                 <div>
//                   <p className="text-xs font-medium text-base-content/60 mb-2">เลือกช่วงเวลาว่าง</p>
//                   <select
//                     className="select select-bordered w-full select-md"
//                     value={form.channel_id && form.start_time ? `${form.channel_id}-${form.start_time}` : ""}
//                     onChange={(e) => {
//                       const val = e.target.value;
//                       if (!val) {
//                         setForm((p) => ({ ...p, channel_id: "", channel_name: "", start_time: "", end_time: "" }));
//                         return;
//                       }
//                       const slot = slots.find((s) => `${s.channel_id}-${s.start_time}` === val);
//                       if (slot) handleSlotSelect(slot);
//                     }}
//                   >
//                     <option value="">-- เลือกช่วงเวลา --</option>
//                     {slots.map((slot) => (
//                       <option key={`${slot.channel_id}-${slot.start_time}`} value={`${slot.channel_id}-${slot.start_time}`}>
//                         {slot.start_time} - {slot.end_time}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 )}
//               </div>
//             )}
//             {!loading &&
//               slots.length === 0 &&
//               bookedSlots.length === 0 &&
//               form.selected_services.length > 0 &&
//               form.booking_date && (
//                 <p className="text-base-content/70 mt-2">
//                   ไม่พบช่วงเวลาว่างในวันนี้
//                 </p>
//               )}
//           </div>
//         )}

//         {step === 6 && (
//           <div className="space-y-4">
//             <h3 className="font-semibold text-base flex items-center gap-2">
//               <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm">6</span>
//               สรุปการจอง
//             </h3>
//             <div className="bg-base-200/50 rounded-xl p-4 sm:p-5 space-y-3 divide-y divide-base-300/50">
//               <div className="flex justify-between items-center">
//                 <span className="text-base-content/70">สาขา</span>
//                 <span className="font-medium">{form.branch_name}</span>
//               </div>
//               <div className="flex justify-between items-center pt-3">
//                 <span className="text-base-content/70">วันที่</span>
//                 <span className="font-medium">{formatDate(form.booking_date)}</span>
//               </div>
//               <div className="flex justify-between items-center pt-3">
//                 <span className="text-base-content/70">รถ</span>
//                 <span className="font-medium">{form.car_label}</span>
//               </div>
//               <div className="flex justify-between items-start gap-2 pt-3">
//                 <span className="text-base-content/70 shrink-0">บริการ</span>
//                 <div className="font-medium text-right">
//                   {form.selected_services.map((s) => (
//                     <div key={s.id}>{s.service_name} ({s.duration_minute} นาที)</div>
//                   ))}
//                 </div>
//               </div>
//               <div className="flex justify-between items-center pt-3">
//                 <span className="text-base-content/70">เวลา</span>
//                 <span className="font-medium">{form.start_time} - {form.end_time}</span>
//               </div>
//               <div className="flex justify-between items-center pt-3">
//                 <span className="text-base-content/70">ราคารวม</span>
//                 <span className="text-lg font-bold text-primary">
//                   ฿{form.selected_services.reduce((a, s) => a + (parseFloat(s.price) || 0), 0).toLocaleString()}
//                 </span>
//               </div>
//             </div>
//             <form onSubmit={handleSubmit} className="pt-2">
//               <button
//                 type="submit"
//                 className="btn btn-primary w-full min-h-[48px]"
//                 disabled={loading}
//               >
//                 {loading ? "กำลังบันทึก..." : "ยืนยันการจอง"}
//               </button>
//             </form>
//           </div>
//         )}

//         <div className="flex flex-col-reverse sm:flex-row justify-between gap-2 mt-6 pt-4 border-t border-base-200">
//           <button
//             type="button"
//             className="btn btn-ghost min-h-[44px]"
//             onClick={() => setStep((s) => Math.max(1, s - 1))}
//             disabled={step === 1}
//           >
//             ← ย้อนกลับ
//           </button>
//           {step < 6 && (
//             <button
//               type="button"
//               className="btn btn-primary min-h-[44px]"
//               onClick={() => setStep((s) => s + 1)}
//               disabled={!canButtonProceed() || loading}
//             >
//               ถัดไป →
//             </button>
//           )}
//         </div>
//         </div>
//       </div>
//       </>
//       )}

//       {/* Booking list - always visible */}
//       <div className="mt-8">
//         <h3 className="font-semibold text-lg mb-4">การจองของฉัน</h3>
//         {bookings.length === 0 ? (
//           <div className="card bg-base-200/30 border border-dashed border-base-300 rounded-2xl p-8 text-center">
//             <p className="text-base-content/60">ยังไม่มีรายการจอง</p>
//             <p className="text-sm text-base-content/50 mt-1">{bookingSuccess ? "จองสำเร็จแล้ว" : "จองล้างรถได้ด้านบน"}</p>
//           </div>
//         ) : (
//           <>
//             <div className="block sm:hidden space-y-3">
//               {bookings.map((b) => (
//                 <div key={b.id} className="card bg-base-100 shadow-sm border border-base-200 rounded-xl overflow-hidden">
//                   <div className="card-body p-4">
//                     <div className="flex justify-between items-start gap-3">
//                       <div>
//                         <p className="font-semibold">{b.booking_no || b.id}</p>
//                         <p className="text-sm text-base-content/70 mt-0.5">
//                           {formatDate(b.booking_date)} · {b.start_time}-{b.end_time}
//                         </p>
//                         <p className="text-sm">{b.service_name}</p>
//                         {(b.plate_no || b.brand) && (
//                           <p className="text-xs text-base-content/60">{[b.plate_no, b.brand, b.model].filter(Boolean).join(" ")}</p>
//                         )}
//                         {b.branch_name && <p className="text-xs text-base-content/50">{b.branch_name}</p>}
//                       </div>
//                       <div className="flex flex-col items-end gap-2">
//                         <span className={`badge ${
//                           b.status_code === "CANCELLED" ? "badge-error" :
//                           b.status_code === "COMPLETED" ? "badge-success" : "badge-info"
//                         }`}>{b.status_code}</span>
//                         {b.status_code === "PENDING" && (
//                           <button
//                             className="btn btn-ghost btn-sm text-error"
//                             onClick={() => handleCancelBooking(b.id)}
//                           >
//                             ยกเลิก
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <div className="hidden sm:block overflow-x-auto rounded-xl border border-base-200">
//               <table className="table">
//                 <thead>
//                   <tr>
//                     <th>เลขที่</th>
//                     <th>วันที่</th>
//                     <th>เวลา</th>
//                     <th>รถ</th>
//                     <th>บริการ</th>
//                     <th>สถานะ</th>
//                     <th></th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {bookings.map((b) => (
//                     <tr key={b.id}>
//                       <td>{b.booking_no || b.id}</td>
//                       <td>{formatDate(b.booking_date)}</td>
//                       <td>{b.start_time} - {b.end_time}</td>
//                       <td>{(b.plate_no || b.brand) ? [b.plate_no, b.brand, b.model].filter(Boolean).join(" ") : "-"}</td>
//                       <td>{b.service_name}</td>
//                       <td>
//                         <span className={`badge ${
//                           b.status_code === "CANCELLED" ? "badge-error" :
//                           b.status_code === "COMPLETED" ? "badge-success" : "badge-info"
//                         }`}>{b.status_code}</span>
//                       </td>
//                       <td>
//                         {b.status_code === "PENDING" && (
//                           <button
//                             className="btn btn-ghost btn-xs text-error"
//                             onClick={() => handleCancelBooking(b.id)}
//                           >
//                             ยกเลิก
//                           </button>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

const CustomerBooking = () => {
  const [step, setStep] = useState(0);
  const [branch, setBranch] = useState([]);
  const [isNewCar, setIsNewCar] = useState(false);
  const [province, setProvince] = useState([]);
  const [size, setSize] = useState([]);
  const [newCarData, setNewCarData] = useState({
    province_id: "",
    plate_no: "",
    brand: "",
    model: "",
    size_id: "",
    color: "",
  });
  const [customerCar, setCustomerCar] = useState([]);
  const [data, setData] = useState({
    branch_id: "",
  });

  useEffect(() => {
    GetBookingBranches().then(({ status, msg }) => {
      if (status === "SUCCESS") {
        setBranch(msg);
      }
    });
  }, []);

  const handleNext = (operator) => {
    if (operator === "+") {
      setStep(step + 1);
    } else {
      setStep(step - 1);
    }
    if (step === 1) {
      GetCustomerCar().then(({ status, msg }) => {
        if (status === "SUCCESS") {
          setCustomerCar(msg);
        } else if (status === "NO DATA") {
          setCustomerCar([]);
        }
      });
    }
    if (step === 2) {
    }
  };

  const canButtonProceed =
    (step === 0 && !!data.branch_id) ||
    (step === 1 && !!data.customer_car_id) ||
    step >= 2;

  const handleAddNewCar = () => {
    setIsNewCar(true);
    GetAllProvince().then(({ status, msg }) => {
      if (status === "SUCCESS") {
        setProvince(msg);
      }
    });
    GetAllCarSize().then(({ status, msg }) => {
      if (status === "SUCCESS") {
        setSize(msg);
      }
    });
  };

  const handleSubmitAddNewCar = () => {};

  return (
    <div className="w-full max-w-2xl mx-auto px-3 sm:px-4 md:px-0 pb-6 sm:pb-8 space-y-4">
      <div className="flex items-center justify-center gap-1 sm:gap-2 overflow-x-auto pb-1">
        {STEP_LABELS.map((_, i) => (
          <div key={i} className="flex items-center shrink-0">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                i === step
                  ? "bg-primary text-primary-content"
                  : i < step
                    ? "bg-primary/20 text-primary"
                    : "bg-base-300 text-base-content/50"
              }`}
            >
              {i < step ? "✓" : i + 1}
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div
                className={`w-4 sm:w-8 h-0.5 mx-0.5 sm:mx-1 ${i < step ? "bg-primary" : "bg-base-300"}`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="card bg-base-100 shadow-sm sm:shadow-md border border-base-200/60 rounded-xl sm:rounded-2xl overflow-hidden w-full">
        <div className="card-body p-4 sm:p-5 md:p-6">
          <h2 className="card-title text-base sm:text-lg">
            {isNewCar ? "เพิ่มรถใหม่" : STEP_LABELS[step]}
          </h2>
          <p className="text-sm sm:text-base text-base-content/80 leading-relaxed">
            {step === 0 && (
              <select
                className="select select-bordered w-full select-md"
                value={data.branch_id}
                onChange={(e) =>
                  setData({ ...data, branch_id: e.target.value })
                }
              >
                <option value="" disabled={true}>
                  -- เลือกสาขา --
                </option>
                {branch.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            )}

            {step === 1 && (
              <div className="space-y-3">
                {!isNewCar ? (
                  <>
                    <select
                      className="select select-bordered w-full select-md"
                      value={data.customer_car_id}
                      onChange={(e) =>
                        setData({ ...data, customer_car_id: e.target.value })
                      }
                    >
                      <option value="">-- เลือกรถ --</option>
                      {customerCar.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.plate_no} - {c.brand} {c.model}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm inline-flex items-center gap-2 text-primary hover:bg-primary/10 mt-2 -ml-2"
                      onClick={() => handleAddNewCar()}
                    >
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary">
                        +
                      </span>
                      เพิ่มรถใหม่
                    </button>
                  </>
                ) : (
                  <form
                    onSubmit={handleAddNewCar}
                    className="rounded-xl border border-base-200/80 bg-base-200/30 p-4 sm:p-6 space-y-5"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                      <div className="form-control">
                        <label htmlFor="size_id" className="label py-1">
                          <span className="label-text font-medium">ขนาดรถ</span>
                        </label>
                        <select
                          id="size_id"
                          value={newCarData.size_id}
                          className="select select-bordered w-full"
                          onChange={(e) =>
                            setNewCarData({ ...newCarData, size_id: e.target.value })
                          }
                          required
                        >
                          <option disabled value="">-- เลือกขนาดรถ --</option>
                          {size?.map((s) => (
                            <option key={s.id} value={s.id}>{s.size}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-control">
                        <label htmlFor="plate_no" className="label py-1">
                          <span className="label-text font-medium">ทะเบียนรถ</span>
                        </label>
                        <input
                          type="text"
                          id="plate_no"
                          value={newCarData.plate_no}
                          placeholder="เช่น กก 1234"
                          className="input input-bordered w-full"
                          onChange={(e) => {
                            const value = e.target.value
                              .replace(/[^0-9\u0E01-\u0E2E ]/g, "")
                              .replace(/\s+/g, " ")
                              .slice(0, 8);
                            setNewCarData({ ...newCarData, plate_no: value });
                          }}
                          maxLength={8}
                          required
                        />
                        <label className="label py-0.5">
                          <span className="label-text-alt text-base-content/60">
                            ตัวเลข 0-9 และตัวอักษรไทย (ก-ฮ) อนุญาตเว้นวรรคได้ 1 ที่
                          </span>
                        </label>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                      <div className="form-control">
                        <label htmlFor="province_id" className="label py-1">
                          <span className="label-text font-medium">จังหวัด</span>
                        </label>
                        <select
                          id="province_id"
                          value={newCarData.province_id}
                          className="select select-bordered w-full"
                          onChange={(e) =>
                            setNewCarData({ ...newCarData, province_id: e.target.value })
                          }
                          required
                        >
                          <option disabled value="">-- เลือกจังหวัด --</option>
                          {province?.map((p) => (
                            <option key={p.id} value={p.id}>{p.province}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-control">
                        <label htmlFor="brand" className="label py-1">
                          <span className="label-text font-medium">ยี่ห้อรถ</span>
                        </label>
                        <input
                          type="text"
                          id="brand"
                          value={newCarData.brand}
                          placeholder="เช่น Toyota"
                          className="input input-bordered w-full"
                          onChange={(e) =>
                            setNewCarData({ ...newCarData, brand: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                      <div className="form-control">
                        <label htmlFor="color" className="label py-1">
                          <span className="label-text font-medium">สีรถ</span>
                        </label>
                        <input
                          type="text"
                          id="color"
                          value={newCarData.color}
                          placeholder="เช่น ขาว"
                          className="input input-bordered w-full"
                          onChange={(e) =>
                            setNewCarData({ ...newCarData, color: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="form-control">
                        <label htmlFor="model" className="label py-1">
                          <span className="label-text font-medium text-base-content/80">
                            รุ่นรถ <span className="text-base-content/50 font-normal">(ไม่จำเป็น)</span>
                          </span>
                        </label>
                        <input
                          type="text"
                          id="model"
                          value={newCarData.model}
                          placeholder="เช่น Corolla"
                          className="input input-bordered w-full"
                          onChange={(e) =>
                            setNewCarData({ ...newCarData, model: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2 border-t border-base-200/80">
                      <button
                        type="button"
                        className="btn btn-ghost flex-1 sm:flex-initial min-h-[44px]"
                        onClick={() => setIsNewCar(false)}
                      >
                        ย้อนกลับ
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary flex-1 sm:flex-initial min-h-[44px]"
                        disabled={
                          !newCarData.size_id ||
                          !newCarData.plate_no ||
                          !newCarData.province_id ||
                          !newCarData.brand ||
                          !newCarData.color
                        }
                      >
                        ยืนยัน
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </p>
          <div className="card-actions justify-end mt-2 sm:mt-4">
            {!isNewCar && (
              <button
                className="btn btn-primary btn-sm sm:btn-md min-h-[44px] sm:min-h-[48px] w-full sm:w-auto"
                onClick={() => handleNext("+")}
                disabled={!canButtonProceed}
              >
                ถัดไป
              </button>
            )}

            {!isNewCar && step > 0 && (
              <button
                className="btn btn-sm sm:btn-md min-h-[44px] sm:min-h-[48px] w-full sm:w-auto"
                onClick={() => handleNext("-")}
              >
                ย้อนกลับ
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerBooking;
