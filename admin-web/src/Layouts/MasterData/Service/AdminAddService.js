import React, { useEffect, useState } from "react";
import {
  GetAllStaff,
  GetAvailableCarSize,
  PostAddService,
} from "../../Modules/Api";
import Notification from "../../Notification/Notification";

const AdminAddService = () => {
  const [carSize, setCarSize] = useState([]);
  const [staff, setStaff] = useState([]);
  const [errors, setErrors] = useState([]);
  const [notificationKey, setNotificationKey] = useState(0);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    status: "",
  });
  const [data, setData] = useState({
    name: "",
    car_size_id: "",
    duration_minute: "",
    price: "",
    required_staff: "",
  });

  const fetchCarSize = () => {
    GetAvailableCarSize().then(({ status, msg }) => {
      if (status === "SUCCESS") {
        setCarSize(msg);
      }
    });
  };

  useEffect(() => {
    fetchCarSize();
    GetAllStaff().then(({ status, msg }) => {
      if (status == "SUCCESS") {
        setStaff(msg);
      }
    });
  }, []);

  const handleAddService = (e) => {
    e.preventDefault();
    PostAddService(data).then(({ status, msg }) => {
      if (status === "SUCCESS") {
        setNotification({
          show: true,
          status: status,
          message: data.name + " " + msg,
        });
        setErrors([]);
        setData({
          name: "",
          car_size_id: "",
          duration_minute: "",
          price: "",
          required_staff: "",
        });
      } else if (status === "WARNING") {
        setErrors(data.name + " " + msg);
        setData({ ...data, name: "" });
      } else if (status === "ERROR") {
        setNotification({
          show: true,
          status: status,
          message: msg,
        });
      }
      setNotificationKey((prev) => prev + 1);
    });
  };

  const handleReset = () => {
    setData({
      name: "",
      car_size_id: "",
      duration_minute: "",
      price: "",
      required_staff: "",
    });
    setErrors([]);
  };

  return (
    <div className="space-y-4">
      {notification.show === true && (
        <Notification
          key={notificationKey}
          message={notification.message}
          status={notification.status}
        />
      )}
      <form onSubmit={handleAddService}>
        <div className="border p-4 bg-base-100 space-y-4 items-center">
          <div className="flex flex-col md:flex-row gap-2 md:items-center font-semibold">
            <span className="w-32">Service</span>
            <input
              type="text"
              value={data.name}
              className={`input input-bordered w-full max-w-md ${
                !data.name ? `input-error` : ``
              }`}
              onChange={(e) => {
                setData({ ...data, name: e.target.value });
              }}
              required
            />
          </div>
          {errors && <p className="text-red-500 text-md">{errors}</p>}
          <div className="flex flex-col md:flex-row gap-2 md:items-center font-semibold">
            <span className="w-32">Car Size</span>
            <select
              value={data.car_size_id}
              className={`select w-full select-bordered max-w-md ${
                !data.car_size_id ? `select-error` : ``
              }`}
              onChange={(e) =>
                setData({ ...data, car_size_id: e.target.value })
              }
              required
            >
              <option disabled={true} value="">
                Pick A Car Size
              </option>
              {carSize &&
                carSize.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.size}
                  </option>
                ))}
            </select>
          </div>
          <div className="flex flex-col md:flex-row gap-2 md:items-center font-semibold">
            <span className="w-32">Price</span>
            <input
              type="number"
              min="1"
              value={data.price}
              className={`input input-bordered w-full max-w-md ${
                !data.price ? `input-error` : ``
              }`}
              onChange={(e) => {
                setData({ ...data, price: e.target.value });
              }}
              required
            />
          </div>
          <div className="flex flex-col md:flex-row gap-2 md:items-center font-semibold">
            <span className="w-32 flex flex-col leading-tight">
              <span>Duration</span>
              <span className="text-xs text-success">(mins)</span>
            </span>
            <input
              type="number"
              min="1"
              value={data.duration_minute}
              className={`input input-bordered w-full max-w-md ${
                !data.duration_minute ? `input-error` : ``
              }`}
              onChange={(e) => {
                setData({ ...data, duration_minute: e.target.value });
              }}
              required
            />
          </div>
          <div className="flex flex-col md:flex-row gap-2 md:items-center font-semibold">
            <span className="w-32">Required Staff</span>
            <input
              type="number"
              min="1"
              max={staff > 0 ? staff : undefined}
              value={data.required_staff}
              className={`input input-bordered w-full max-w-md ${
                !data.required_staff ? `input-error` : ``
              }`}
              onChange={(e) => {
                setData({ ...data, required_staff: e.target.value });
              }}
              required
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button type="submit" className="btn btn-success text-white">
              SUBMIT
            </button>
            <button type="button" className="btn" onClick={handleReset}>
              CANCEL
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminAddService;
