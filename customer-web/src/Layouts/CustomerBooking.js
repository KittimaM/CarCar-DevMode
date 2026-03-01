import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
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

const CustomerBooking = () => {
  const [loaded, setLoaded] = useState(false);
  const [step, setStep] = useState(0);
  const [branch, setBranch] = useState([]);
  const [serviceRates, setServiceRates] = useState([]);
  const [province, setProvince] = useState([]);
  const [size, setSize] = useState([]);
  const [errors, setErrors] = useState(null);
  const [isNewCar, setIsNewCar] = useState(false);
  const [newCarData, setNewCarData] = useState({
    province_id: "",
    plate_no: "",
    brand: "",
    model: null,
    size_id: "",
    color: "",
  });
  const [customerCar, setCustomerCar] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [countdown, setCountdown] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  const [data, setData] = useState({
    branch_id: "",
    customer_car_id: "",
    service_car_size_ids: [],
    booking_date: null,
    selected_slot: null,
  });

  const fetchCustomerCar = () => {
    GetCustomerCar().then(({ status, msg }) => {
      if (status === "SUCCESS") {
        setCustomerCar(msg);
      } else if (status === "NO DATA") {
        setCustomerCar([]);
        setIsNewCar(true);
      }
    });
  };

  useEffect(() => {
    Promise.all([
      GetBookingBranches(),
      GetAllProvince(),
      GetAllCarSize(),
      GetCustomerCar(),
    ]).then(([branchRes, provinceRes, sizeRes, customerCarRes]) => {
      if (branchRes.status === "SUCCESS") {
        setBranch(branchRes.msg);
      }
      if (provinceRes.status === "SUCCESS") {
        setProvince(provinceRes.msg);
      }
      if (sizeRes.status === "SUCCESS") {
        setSize(sizeRes.msg);
      }
      if (customerCarRes.status === "SUCCESS") {
        setCustomerCar(customerCarRes.msg);
      } else if (customerCarRes.status === "NO DATA") {
        setCustomerCar([]);
        setIsNewCar(true);
      }
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (step === 5) {
      setCountdown(300);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setCountdown(null);
    }
  }, [step]);

  const formatCountdown = (seconds) => {
    if (seconds === null) return "";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  };

  const handleNext = (operator) => {
    let currentStep = step;
    if (operator === "+") {
      currentStep = currentStep + 1;
    } else {
      currentStep = currentStep - 1;
    }

    if (currentStep === 2) {
      setLoaded(false);
      GetBookingServiceRates({
        customer_car_id: data.customer_car_id,
        branch_id: data.branch_id,
      }).then(({ status, msg }) => {
        if (status === "SUCCESS") {
          const grouped = msg.reduce((acc, row) => {
            if (!acc[row.id]) {
              acc[row.id] = {
                service_car_size_id: row.id,
                service_name: row.service_name,
                duration: row.duration_minute,
                price: row.price,
                channels: {},
              };
            }

            if (!acc[row.id].channels[row.channel_id]) {
              acc[row.id].channels[row.channel_id] = {
                channel_id: row.channel_id,
                priority: row.priority,
                schedule: [],
              };
            }

            acc[row.id].channels[row.channel_id].schedule.push({
              day_of_week: row.day_of_week,
              start_time: row.start_time,
              end_time: row.end_time,
            });

            return acc;
          }, {});

          const result = Object.values(grouped).map((service) => ({
            ...service,
            channels: Object.values(service.channels).sort(
              (a, b) => a.priority - b.priority,
            ),
          }));
          console.log(result);
          setServiceRates(result);
        } else if (status === "NO DATA") {
          setServiceRates([]);
          setErrors(msg);
        }
        setLoaded(true);
      });
    }

    if (currentStep === 4) {
      setLoaded(false);
      const bookingDateStr = data.booking_date
        ? `${data.booking_date.getFullYear()}-${String(data.booking_date.getMonth() + 1).padStart(2, "0")}-${String(data.booking_date.getDate()).padStart(2, "0")}`
        : null;
      
      PostBookingAvailableSlots({
        branch_id: Number(data.branch_id),
        booking_date: bookingDateStr,
        service_car_size_ids: data.service_car_size_ids,
      }).then(({ status, msg }) => {
        if (status === "SUCCESS") {
          setTimeSlots(msg);
        } else {
          setTimeSlots([]);
          setErrors(msg);
        }
        setLoaded(true);
      });
      setData((prev) => ({ ...prev, selected_slot: null }));
    }

    setStep(currentStep);
  };

  const canButtonProceed =
    (step === 0 && !!data.branch_id) ||
    (step === 1 && !!data.customer_car_id) ||
    (step === 2 && data.service_car_size_ids.length > 0) ||
    (step === 3 && !!data.booking_date) ||
    (step === 4 && !!data.selected_slot) ||
    step >= 5;

  const handleSubmitAddNewCar = (e) => {
    e.preventDefault();
    setLoaded(false);
    PostAddCustomerCar(newCarData).then(({ status, msg }) => {
      if (status === "SUCCESS") {
        fetchCustomerCar();
        setIsNewCar(false);
        setData({
          ...data,
          customer_car_id: msg,
        });
        setNewCarData({
          province_id: "",
          plate_no: "",
          brand: "",
          model: null,
          size_id: "",
          color: "",
        });
        setErrors(null);
      } else if (status === "WARNING") {
        setErrors("ทะเบียนรถนี้มีอยู่ในระบบแล้ว");
        setNewCarData({
          ...newCarData,
          plate_no: "",
        });
      }
      setLoaded(true);
    });
  };

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
            {isNewCar && step == 1 ? "เพิ่มรถใหม่" : STEP_LABELS[step]}
          </h2>
          <div className="text-sm sm:text-base text-base-content/80 leading-relaxed">
            {!loaded && (
              <div className="flex items-center justify-center py-8">
                <span className="loading loading-spinner loading-lg text-primary"></span>
              </div>
            )}
            {loaded && step === 0 && (
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

            {loaded && step === 1 && (
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
                      onClick={() => setIsNewCar(true)}
                    >
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary">
                        +
                      </span>
                      เพิ่มรถใหม่
                    </button>
                  </>
                ) : (
                  <form
                    onSubmit={handleSubmitAddNewCar}
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
                            setNewCarData({
                              ...newCarData,
                              size_id: e.target.value,
                            })
                          }
                          required
                        >
                          <option disabled value="">
                            -- เลือกขนาดรถ --
                          </option>
                          {size?.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.size}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-control">
                        <label htmlFor="plate_no" className="label py-1">
                          <span className="label-text font-medium">
                            ทะเบียนรถ
                          </span>
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
                          {errors ? (
                            <span className="label-text-alt text-error">
                              {errors}
                            </span>
                          ) : (
                            <span className="label-text-alt text-base-content/60">
                              ตัวอักษรไทย (ก-ฮ) และตัวเลข 0-9
                            </span>
                          )}
                        </label>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                      <div className="form-control">
                        <label htmlFor="province_id" className="label py-1">
                          <span className="label-text font-medium">
                            จังหวัด
                          </span>
                        </label>
                        <select
                          id="province_id"
                          value={newCarData.province_id}
                          className="select select-bordered w-full"
                          onChange={(e) =>
                            setNewCarData({
                              ...newCarData,
                              province_id: e.target.value,
                            })
                          }
                          required
                        >
                          <option disabled value="">
                            -- เลือกจังหวัด --
                          </option>
                          {province?.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.province}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-control">
                        <label htmlFor="brand" className="label py-1">
                          <span className="label-text font-medium">
                            ยี่ห้อรถ
                          </span>
                        </label>
                        <input
                          type="text"
                          id="brand"
                          value={newCarData.brand}
                          placeholder="เช่น Toyota"
                          className="input input-bordered w-full"
                          onChange={(e) =>
                            setNewCarData({
                              ...newCarData,
                              brand: e.target.value,
                            })
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
                            setNewCarData({
                              ...newCarData,
                              color: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="form-control">
                        <label htmlFor="model" className="label py-1">
                          <span className="label-text font-medium text-base-content/80">
                            รุ่นรถ{" "}
                            <span className="text-base-content/50 font-normal">
                              (ไม่จำเป็น)
                            </span>
                          </span>
                        </label>
                        <input
                          type="text"
                          id="model"
                          value={newCarData.model}
                          placeholder="เช่น Corolla"
                          className="input input-bordered w-full"
                          onChange={(e) =>
                            setNewCarData({
                              ...newCarData,
                              model: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2 border-t border-base-200/80">
                      <button
                        type="button"
                        className="btn btn-ghost flex-1 sm:flex-initial min-h-[44px]"
                        onClick={() => {
                          setIsNewCar(false);
                          setNewCarData({
                            size_id: "",
                            plate_no: "",
                            province_id: "",
                            brand: "",
                            color: "",
                            model: null,
                          });
                        }}
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

            {loaded && step === 2 && (
              <div className="space-y-3">
                {errors && (
                  <span className="label-text-alt text-error">{errors}</span>
                )}
                {serviceRates.length === 0 ? (
                  <p className="text-base-content/70">
                    ไม่พบบริการสำหรับรถคันนี้
                  </p>
                ) : (
                  <>
                    <p className="text-sm text-base-content/60">
                      เลือกได้หลายรายการ
                    </p>
                    <div className="grid gap-2">
                      {serviceRates.map((service) => {
                        const isSelected = data.service_car_size_ids.includes(
                          service.service_car_size_id,
                        );
                        const availableDays = [
                          ...new Set(
                            service.channels.flatMap((ch) =>
                              ch.schedule.map((s) => s.day_of_week),
                            ),
                          ),
                        ];
                        const dayOrder = [
                          "Sunday",
                          "Monday",
                          "Tuesday",
                          "Wednesday",
                          "Thursday",
                          "Friday",
                          "Saturday",
                        ];
                        const sortedDays = availableDays.sort(
                          (a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b),
                        );
                        const dayAbbr = {
                          Sunday: "อา.",
                          Monday: "จ.",
                          Tuesday: "อ.",
                          Wednesday: "พ.",
                          Thursday: "พฤ.",
                          Friday: "ศ.",
                          Saturday: "ส.",
                        };
                        return (
                          <button
                            key={service.service_car_size_id}
                            type="button"
                            onClick={() => {
                              setData((prev) => ({
                                ...prev,
                                service_car_size_ids: isSelected
                                  ? prev.service_car_size_ids.filter(
                                      (id) =>
                                        id !== service.service_car_size_id,
                                    )
                                  : [
                                      ...prev.service_car_size_ids,
                                      service.service_car_size_id,
                                    ],
                              }));
                            }}
                            className={`flex flex-col gap-2 p-4 rounded-xl border-2 text-left transition-all ${
                              isSelected
                                ? "border-primary bg-primary/5"
                                : "border-base-300 hover:border-base-content/20 hover:bg-base-200/50"
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                              <span className="font-medium flex items-center gap-2">
                                {isSelected && (
                                  <span className="text-primary">✓</span>
                                )}
                                {service.service_name}
                              </span>
                              <span className="text-sm text-base-content/70">
                                {service.duration} นาที · ฿
                                {Number(service.price).toLocaleString()}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {sortedDays.map((day) => (
                                <span
                                  key={day}
                                  className="text-xs px-2 py-0.5 rounded-full bg-base-200 text-base-content/70"
                                >
                                  {dayAbbr[day]}
                                </span>
                              ))}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            )}

            {loaded && step === 3 && (
              <div className="space-y-4">
                <p className="text-sm text-base-content/60">
                  จองล่วงหน้าได้ไม่เกิน 2 เดือน
                </p>
                <div className="flex justify-center">
                  <DatePicker
                    selected={data.booking_date}
                    onChange={(date) =>
                      setData((prev) => ({ ...prev, booking_date: date }))
                    }
                    minDate={(() => {
                      const tomorrow = new Date();
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      return tomorrow;
                    })()}
                    maxDate={(() => {
                      const maxDate = new Date();
                      maxDate.setMonth(maxDate.getMonth() + 2);
                      return maxDate;
                    })()}
                    filterDate={(date) => {
                      const dayName = DAY_NAMES[date.getDay()];
                      const selectedServices = serviceRates.filter((s) =>
                        data.service_car_size_ids.includes(
                          s.service_car_size_id,
                        ),
                      );
                      if (selectedServices.length === 0) return true;
                      return selectedServices.every((service) => {
                        const availableDays = service.channels.flatMap((ch) =>
                          ch.schedule.map((sch) => sch.day_of_week),
                        );
                        return availableDays.includes(dayName);
                      });
                    }}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="เลือกวันที่"
                    inline
                  />
                </div>
                {data.booking_date && (
                  <div className="text-center p-3 bg-primary/5 rounded-xl border border-primary/20">
                    <p className="text-sm text-base-content/70">วันที่เลือก</p>
                    <p className="text-lg font-semibold text-primary">
                      {data.booking_date.toLocaleDateString("th-TH", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                )}
              </div>
            )}

            {loaded && step === 4 && (
              <div className="space-y-4">
                <div className="text-center p-3 bg-base-200 rounded-xl">
                  <p className="text-sm text-base-content/70">ระยะเวลารวม</p>
                  <p className="text-lg font-semibold">
                    {serviceRates
                      .filter((s) => data.service_car_size_ids.includes(s.service_car_size_id))
                      .reduce((sum, s) => sum + s.duration, 0)} นาที
                  </p>
                </div>
                {timeSlots.length === 0 ? (
                  <p className="text-center text-base-content/70">
                    ไม่พบช่วงเวลาที่ว่าง
                  </p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {timeSlots.map((slot, index) => {
                      const slotKey = `${slot.channel_id}-${slot.start_time}`;
                      const isSelected = data.selected_slot?.channel_id === slot.channel_id && 
                                         data.selected_slot?.start_time === slot.start_time;
                      return (
                        <button
                          key={slotKey}
                          type="button"
                          onClick={() =>
                            setData((prev) => ({ ...prev, selected_slot: slot }))
                          }
                          className={`p-3 rounded-xl border-2 text-center transition-all ${
                            isSelected
                              ? "border-primary bg-primary/5"
                              : "border-base-300 hover:border-base-content/20 hover:bg-base-200/50"
                          }`}
                        >
                          <span className="font-medium">
                            {slot.start_time}
                          </span>
                          <span className="text-base-content/50"> - </span>
                          <span className="font-medium">
                            {slot.end_time}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
                {data.selected_slot && (
                  <div className="text-center p-3 bg-primary/5 rounded-xl border border-primary/20">
                    <p className="text-sm text-base-content/70">เวลาที่เลือก</p>
                    <p className="text-lg font-semibold text-primary">
                      {data.selected_slot.start_time} - {data.selected_slot.end_time}
                    </p>
                  </div>
                )}
              </div>
            )}

            {loaded && step === 5 && (() => {
              const selectedBranch = branch.find((b) => String(b.id) === String(data.branch_id));
              const selectedCar = customerCar.find((c) => String(c.id) === String(data.customer_car_id));
              const selectedServices = serviceRates.filter((s) =>
                data.service_car_size_ids.includes(s.service_car_size_id)
              );
              const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration, 0);
              const totalPrice = selectedServices.reduce((sum, s) => sum + Number(s.price), 0);

              return (
                <div className="space-y-4">
                  <div className="bg-base-200 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-base-content/70">สาขา</span>
                      <span className="font-medium text-right">{selectedBranch?.name || "-"}</span>
                    </div>
                    <div className="divider my-0"></div>
                    <div className="flex justify-between items-start">
                      <span className="text-base-content/70">รถ</span>
                      <span className="font-medium text-right">
                        {selectedCar ? `${selectedCar.plate_no} (${selectedCar.brand} ${selectedCar.model || ""})` : "-"}
                      </span>
                    </div>
                    <div className="divider my-0"></div>
                    <div className="flex justify-between items-start">
                      <span className="text-base-content/70">บริการ</span>
                      <div className="text-right">
                        {selectedServices.map((s) => (
                          <div key={s.service_car_size_id} className="font-medium">
                            {s.service_name}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="divider my-0"></div>
                    <div className="flex justify-between items-start">
                      <span className="text-base-content/70">วันที่</span>
                      <span className="font-medium text-right">
                        {data.booking_date?.toLocaleDateString("th-TH", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="divider my-0"></div>
                    <div className="flex justify-between items-start">
                      <span className="text-base-content/70">เวลา</span>
                      <span className="font-medium text-right">
                        {data.selected_slot?.start_time} - {data.selected_slot?.end_time}
                      </span>
                    </div>
                    <div className="divider my-0"></div>
                    <div className="flex justify-between items-start">
                      <span className="text-base-content/70">ระยะเวลา</span>
                      <span className="font-medium text-right">{totalDuration} นาที</span>
                    </div>
                  </div>
                  <div className="bg-primary/10 rounded-xl p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg">ราคารวม</span>
                      <span className="text-2xl font-bold text-primary">
                        ฿{totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  {countdown !== null && countdown > 0 && (
                    <div className={`alert ${countdown <= 60 ? "alert-error" : "alert-warning"}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span>กรุณายืนยันการจองภายใน <strong>{formatCountdown(countdown)}</strong> นาที</span>
                    </div>
                  )}
                  {countdown === 0 && (
                    <div className="alert alert-error">
                      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>หมดเวลา! กรุณาย้อนกลับเพื่อเลือกเวลาใหม่</span>
                    </div>
                  )}
                </div>
              );
            })()}

            {step === 6 && bookingResult && (
              <div className="space-y-4 text-center">
                <div className="text-6xl">✅</div>
                <h2 className="text-2xl font-bold text-success">จองสำเร็จ!</h2>
                <div className="bg-base-200 rounded-xl p-4 space-y-2">
                  <p className="text-base-content/70">หมายเลขการจอง</p>
                  <p className="text-2xl font-bold">{bookingResult.booking_no}</p>
                </div>
                <p className="text-sm text-base-content/70">
                  กรุณาชำระเงินภายใน 5 นาที มิฉะนั้นการจองจะถูกยกเลิกอัตโนมัติ
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setStep(0);
                    setData({
                      branch_id: "",
                      customer_car_id: "",
                      service_car_size_ids: [],
                      booking_date: null,
                      selected_slot: null,
                    });
                    setBookingResult(null);
                    setErrors(null);
                  }}
                >
                  จองใหม่
                </button>
              </div>
            )}
          </div>
          <div className="card-actions justify-end mt-2 sm:mt-4">
            {!(isNewCar && step == 1) && step < 5 && step !== 6 && (
              <button
                className="btn btn-primary btn-sm sm:btn-md min-h-[44px] sm:min-h-[48px] w-full sm:w-auto"
                onClick={() => handleNext("+")}
                disabled={!canButtonProceed}
              >
                ถัดไป
              </button>
            )}

            {step === 5 && (
              <button
                className="btn btn-success btn-sm sm:btn-md min-h-[44px] sm:min-h-[48px] w-full sm:w-auto"
                disabled={countdown === 0 || submitting}
                onClick={() => {
                  setSubmitting(true);
                  const bookingDateStr = data.booking_date
                    ? `${data.booking_date.getFullYear()}-${String(data.booking_date.getMonth() + 1).padStart(2, "0")}-${String(data.booking_date.getDate()).padStart(2, "0")}`
                    : null;
                  PostAddCustomerBooking({
                    customer_car_id: Number(data.customer_car_id),
                    channel_id: data.selected_slot.channel_id,
                    service_car_size_ids: data.service_car_size_ids,
                    booking_date: bookingDateStr,
                    start_time: data.selected_slot.start_time,
                    end_time: data.selected_slot.end_time,
                  }).then(({ status, msg }) => {
                    setSubmitting(false);
                    if (status === "SUCCESS") {
                      setBookingResult(msg);
                      setStep(6);
                    } else {
                      setErrors(msg);
                    }
                  });
                }}
              >
                {submitting ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  "ยืนยันการจอง"
                )}
              </button>
            )}

            {!(isNewCar && step == 1) && step > 0 && step !== 6 && (
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
