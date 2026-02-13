import React, { useEffect, useState } from "react";
import Notification from "../../Notification/Notification";
import {
  GetAllStaff,
  GetAvailableCarSize,
  UpdateService,
} from "../../Modules/Api";
import Select from "react-select";

const AdminEditService = ({ editItem }) => {
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
    id: editItem.id,
    name: editItem.name,
    car_size_id: editItem.car_size_id,
    duration_minute: editItem.duration_minute,
    price: editItem.price,
    required_staff: editItem.required_staff,
    staff_ids: editItem.staffs.map((staff) => staff.staff_id),
  });

  useEffect(() => {
    GetAvailableCarSize().then(({ status, msg }) => {
      if (status == "SUCCESS") {
        setCarSize(msg);
      }
    });
    GetAllStaff().then(({ status, msg }) => {
      if (status == "SUCCESS") {
        setStaff(
          msg.map((staff) => {
            return { value: staff.id, label: staff.name };
          }),
        );
      }
    });
  }, []);

  const handleEditService = (e) => {
    e.preventDefault();
    UpdateService(data).then(({ status, msg }) => {
      setNotification({
        show: true,
        status: status,
        message: msg,
      });
      setNotificationKey((prev) => prev + 1);
      if (status === "SUCCESS") {
        setErrors([]);
      } else if (status === "WARNING") {
        setErrors(msg);
        setData({
          ...data,
          name: editItem.name,
          car_size_id: editItem.car_size_id,
        });
      }
    });
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
          {errors && <p className="text-red-500 text-md">{errors}</p>}
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
          <div className="flex flex-col md:flex-row gap-2 md:items-center font-semibold">
            <span className="w-32">Staff</span>
            <div className="w-full max-w-md">
              <Select
                required
                isMulti
                options={staff}
                placeholder="Pick Staff(s)..."
                value={staff.filter((option) =>
                  (data.staff_ids || []).includes(option.value),
                )}
                onChange={(selected) =>
                  setData({
                    ...data,
                    staff_ids: selected
                      ? selected.map((item) => item.value)
                      : [],
                  })
                }
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button type="submit" className="btn btn-success text-white">
              SUBMIT
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => {
                setData(editItem);
                setErrors([]);
              }}
            >
              CANCEL
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminEditService;
