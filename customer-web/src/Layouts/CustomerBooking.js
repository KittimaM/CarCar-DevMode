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
  const [data, setData] = useState({
    branch_id: "",
    customer_car_id: "",
    service_car_size_ids: [],
    booking_date: null,
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
            if (!acc[row.channel_id]) {
              acc[row.channel_id] = {
                channel_id: row.channel_id,
                max_capacity: row.max_capacity,
                services: {},
              };
            }

            if (!acc[row.channel_id].services[row.id]) {
              acc[row.channel_id].services[row.id] = {
                service_car_size_id: row.id,
                service_name: row.service_name,
                duration: row.duration_minute,
                price: row.price,
                available_days: [],
              };
            }

            acc[row.channel_id].services[row.id].available_days.push({
              day_of_week: row.day_of_week,
              open: row.start_time,
              close: row.end_time,
            });

            return acc;
          }, {});

          const result = Object.values(grouped).map((channel) => ({
            ...channel,
            services: Object.values(channel.services),
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
    setStep(currentStep);
  };

  const canButtonProceed =
    (step === 0 && !!data.branch_id) ||
    (step === 1 && !!data.customer_car_id) ||
    (step === 2 && data.service_car_size_ids.length > 0) ||
    (step === 3 && !!data.booking_date) ||
    step >= 4;

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
                      {serviceRates.flatMap((channel) =>
                        channel.services.map((s) => {
                          const isSelected = data.service_car_size_ids.includes(
                            s.service_car_size_id,
                          );
                          return (
                            <button
                              key={s.service_car_size_id}
                              type="button"
                              onClick={() => {
                                setData((prev) => ({
                                  ...prev,
                                  service_car_size_ids: isSelected
                                    ? prev.service_car_size_ids.filter(
                                        (id) => id !== s.service_car_size_id,
                                      )
                                    : [
                                        ...prev.service_car_size_ids,
                                        s.service_car_size_id,
                                      ],
                                }));
                              }}
                              className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 p-4 rounded-xl border-2 text-left transition-all ${
                                isSelected
                                  ? "border-primary bg-primary/5"
                                  : "border-base-300 hover:border-base-content/20 hover:bg-base-200/50"
                              }`}
                            >
                              <span className="font-medium flex items-center gap-2">
                                {isSelected && (
                                  <span className="text-primary">✓</span>
                                )}
                                {s.service_name}
                              </span>
                              <span className="text-sm text-base-content/70">
                                {s.duration} นาที · ฿
                                {Number(s.price).toLocaleString()}
                              </span>
                            </button>
                          );
                        }),
                      )}
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
          </div>
          <div className="card-actions justify-end mt-2 sm:mt-4">
            {!(isNewCar && step == 1) && (
              <button
                className="btn btn-primary btn-sm sm:btn-md min-h-[44px] sm:min-h-[48px] w-full sm:w-auto"
                onClick={() => handleNext("+")}
                disabled={!canButtonProceed}
              >
                ถัดไป
              </button>
            )}

            {!(isNewCar && step == 1) && step > 0 && (
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
