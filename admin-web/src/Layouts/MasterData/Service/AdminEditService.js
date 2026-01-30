import React, { useEffect, useState } from "react";
import Notification from "../../Notification/Notification";
import { GetAllStaff, GetAvailableCarSize, UpdateService } from "../../Api";

const AdminEditService = ({ editItem }) => {
  const [data, setData] = useState(editItem);
  const [carSize, setCarSize] = useState([]);
  const [staffNumber, setStaffNumber] = useState(0);
  const [errors, setErrors] = useState([]);
  const [notificationKey, setNotificationKey] = useState(0);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    status: "",
  });

  useEffect(() => {
    GetAvailableCarSize().then(({ status, msg }) => {
      if (status == "SUCCESS") {
        setCarSize(msg);
      }
    });
    GetAllStaff().then(({ status, msg }) => {
      if (status == "SUCCESS") {
        setStaffNumber(msg.length);
      }
    });
  }, []);

  const handleEditService = (e) => {
    e.preventDefault();
    UpdateService(data).then(({ status, msg }) => {
      if (status === "SUCCESS") {
        setNotification({
          show: true,
          status: status,
          message: data.service + " " + msg,
        });
        setErrors([]);
      } else if (status === "WARNING") {
        setErrors(data.service + " " + msg);
        setData({ ...data, service: null });
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
    setData(editItem);
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
      <form onSubmit={handleEditService}>
        <div className="border p-4 bg-base-100 space-y-4 items-center">
          <div className="flex flex-col md:flex-row gap-2 md:items-center font-semibold">
            <span className="w-32">Service</span>
            <input
              type="text"
              value={data.service}
              className={`input input-bordered w-full max-w-md ${!data.service ? `input-error` : ``}`}
              onChange={(e) => {
                setData({ ...data, service: e.target.value });
              }}
              required
            />
          </div>
          {errors && <p className="text-red-500 text-md">{errors}</p>}
          <div className="flex flex-col md:flex-row gap-2 md:items-center font-semibold">
            <span className="w-32 flex flex-col leading-tight">
              <span>Description</span>
              <span className="text-xs text-success">(optional)</span>
            </span>
            <input
              type="text"
              value={data.description}
              className={`input input-bordered w-full max-w-md`}
              onChange={(e) => {
                setData({ ...data, description: e.target.value });
              }}
            />
          </div>
          <div className="flex flex-col md:flex-row gap-2 md:items-center font-semibold">
            <span className="w-32">Car Size</span>
            <select
              value={data.car_size_id}
              className={`select w-full select-bordered max-w-md ${!data.car_size_id ? `select-error` : ``}`}
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
              className={`input input-bordered w-full max-w-md ${!data.price ? `input-error` : ``}`}
              onChange={(e) => {
                setData({ ...data, price: e.target.value });
              }}
              required
            />
          </div>
          <div className="flex flex-col md:flex-row gap-2 md:items-center font-semibold">
            <span className="w-32 flex flex-col leading-tight">
              <span>Usage Time</span>
              <span className="text-xs text-success">(mins)</span>
            </span>
            <input
              type="number"
              min="1"
              value={data.used_time}
              className={`input input-bordered w-full max-w-md ${!data.used_time ? `input-error` : ``}`}
              onChange={(e) => {
                setData({ ...data, used_time: e.target.value });
              }}
              required
            />
          </div>
          <div className="flex flex-col md:flex-row gap-2 md:items-center font-semibold">
            <span className="w-32">Usage Man</span>
            <input
              type="number"
              min="1"
              max={staffNumber}
              value={data.used_people}
              className={`input input-bordered w-full max-w-md ${!data.used_people ? `input-error` : ``}`}
              onChange={(e) => {
                setData({ ...data, used_people: e.target.value });
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

export default AdminEditService;
