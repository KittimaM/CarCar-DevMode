import React, { useEffect, useState } from "react";
import Notification from "../../Notification/Notification";
import { GetAvailableService, UpdateChannel } from "../../Modules/Api";
import Select from "react-select";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const buildScheduleFromEditItem = (editItem) => {
  const existing = editItem.schedule || [];
  return DAYS.map((day) => {
    const found = existing.find((s) => s.day_of_week === day);
    const st =
      found?.start_time != null ? String(found.start_time).substring(0, 5) : "";
    const et =
      found?.end_time != null ? String(found.end_time).substring(0, 5) : "";
    return { day_of_week: day, start_time: st, end_time: et };
  });
};

const AdminEditChannel = ({ editItem }) => {
  const [service, setService] = useState([]);
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
    max_capacity: editItem.max_capacity,
    is_available: editItem.is_available,
    service_ids: (editItem.services || []).map((s) => s.service_id),
    schedule: buildScheduleFromEditItem(editItem),
  });

  useEffect(() => {
    GetAvailableService().then(({ status, msg }) => {
      if (status === "SUCCESS") {
        setService(
          msg.map((service) => {
            return { value: service.id, label: service.name };
          })
        );
      }
    });
  }, []);

  const handleEdit = (e) => {
    e.preventDefault();
    UpdateChannel(data).then(({ status, msg }) => {
      if (status === "SUCCESS") {
        setNotification({
          show: true,
          status: status,
          message: data.name + " " + msg,
        });
        setErrors([]);
      } else if (status === "WARNING") {
        setErrors(data.name + " " + msg);
        setData({ ...data, name: null });
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

  return (
    <div className="space-y-4">
      {notification.show === true && (
        <Notification
          key={notificationKey}
          message={notification.message}
          status={notification.status}
        />
      )}

      <form onSubmit={handleEdit}>
        <div className="border p-4 bg-base-100 space-y-4 items-center">
          <div className="flex flex-col md:flex-row gap-2 md:items-center font-semibold">
            <span className="w-32">Channel</span>
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
            <span className="w-32">Service</span>
            <div className="w-full max-w-md">
              <Select
                required
                isMulti
                options={service}
                placeholder="Pick Service(s)..."
                value={service.filter((option) =>
                  (data.service_ids || []).includes(option.value)
                )}
                onChange={(selected) =>
                  setData({
                    ...data,
                    service_ids: selected
                      ? selected.map((item) => item.value)
                      : [],
                  })
                }
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-2 md:items-center font-semibold">
            <span className="w-32">Max Capacity</span>
            <input
              type="number"
              min="1"
              value={data.max_capacity}
              className={`input input-bordered w-full max-w-md ${
                !data.max_capacity ? `input-error` : ``
              }`}
              onChange={(e) => {
                setData({ ...data, max_capacity: e.target.value });
              }}
              required
            />
          </div>
          <div className="border p-4 bg-base-100 space-y-4 items-center">
            <h2 className="text-lg font-bold">Channel Schedule</h2>
            <p className="text-sm text-base-content/70 mb-2">
              Set start and end time per day (leave blank if closed)
            </p>
            {(data.schedule || []).map((daySchedule, index) => (
              <div
                key={daySchedule.day_of_week}
                className="flex flex-col md:flex-row gap-2 md:items-center font-semibold"
              >
                <span className="w-28">{daySchedule.day_of_week}</span>
                <span className="text-sm">Start</span>
                <input
                  type="time"
                  value={daySchedule.start_time}
                  className="input input-bordered w-full max-w-xs"
                  onChange={(e) => {
                    const next = data.schedule.map((s, i) =>
                      i === index ? { ...s, start_time: e.target.value } : s
                    );
                    setData({ ...data, schedule: next });
                  }}
                />
                <span className="text-sm">End</span>
                <input
                  type="time"
                  value={daySchedule.end_time}
                  className="input input-bordered w-full max-w-xs"
                  onChange={(e) => {
                    const next = data.schedule.map((s, i) =>
                      i === index ? { ...s, end_time: e.target.value } : s
                    );
                    setData({ ...data, schedule: next });
                  }}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <button type="submit" className="btn btn-success text-white">
              SUBMIT
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => {
                setData({
                  id: editItem.id,
                  name: editItem.name,
                  max_capacity: editItem.max_capacity,
                  is_available: editItem.is_available,
                  service_ids: (editItem.services || []).map(
                    (s) => s.service_id
                  ),
                  schedule: buildScheduleFromEditItem(editItem),
                });
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

export default AdminEditChannel;
