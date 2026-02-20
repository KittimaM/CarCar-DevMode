import React, { useState, useEffect } from "react";
import Notification from "../../Notification/Notification";
import {
  GetAllChannel,
  GetAllServiceRates,
  PostAddChannelMatching,
} from "../../Modules/Api";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const initialSchedule = DAYS.reduce(
  (acc, day) => ({ ...acc, [day]: { start_time: "", end_time: "" } }),
  {},
);

const ChannelMatchingAddPage = ({ onSuccess, onBack }) => {
  const [service, setService] = useState([]);
  const [channel, setChannel] = useState([]);
  const [errors, setErrors] = useState("");
  const [notificationKey, setNotificationKey] = useState(0);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    status: "",
  });
  const [data, setData] = useState({
    channel_id: "",
    service_ids: [],
    schedule: initialSchedule,
  });

  useEffect(() => {
    GetAllServiceRates().then(({ status, msg }) => {
      if (status === "SUCCESS") {
        setService(msg);
      }
    });

    GetAllChannel().then(({ status, msg }) => {
      if (status === "SUCCESS") {
        setChannel(msg);
      }
    });
  }, []);

  const handleScheduleChange = (day, field, value) => {
    setData((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: { ...prev.schedule[day], [field]: value },
      },
    }));
  };

  const handleSelectService = (id) => {
    const idStr = String(id);
    setData((prev) => ({
      ...prev,
      service_ids: prev.service_ids.includes(idStr)
        ? prev.service_ids.filter((sid) => sid !== idStr)
        : [...prev.service_ids, idStr],
    }));
  };

  const handleAdd = (e) => {
    e.preventDefault();
    PostAddChannelMatching(data).then(({ status, msg }) => {
      if (status === "SUCCESS") {
        setErrors("");
        onSuccess?.(msg);
      } else {
        setErrors(msg);
        setNotification({
          show: true,
          status: status,
          message: msg,
        });
        setNotificationKey((prev) => prev + 1);
        setData({
          service_ids: [],
          channel_id: "",
          schedule: initialSchedule,
        });
      }
    });
  };

  return (
    <div className="space-y-4">
      {notification.show && (
        <Notification
          key={notificationKey}
          message={notification.message}
          status={notification.status}
        />
      )}
      <form onSubmit={handleAdd}>
        <div className="border p-4 bg-base-100 space-y-4 items-center">
          {errors && <p className="text-red-500 text-md">{errors}</p>}
          {service.length > 0 && channel.length > 0 && (
            <>
              <div className="flex flex-col md:flex-row gap-2 md:items-center font-semibold">
                <span className="w-32">Channel</span>
                <select
                  value={data.channel_id}
                  className={`select w-full select-bordered max-w-md ${
                    !data.channel_id ? `select-error` : ``
                  }`}
                  onChange={(e) =>
                    setData({ ...data, channel_id: e.target.value })
                  }
                  required
                >
                  <option disabled={true} value="">
                    Pick A Channel
                  </option>
                  {channel &&
                    channel.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex flex-col gap-2 font-semibold">
                <span className="w-32">Services</span>
                <div
                  className={`border rounded-lg p-3 max-w-md max-h-48 overflow-y-auto space-y-2 ${
                    data.service_ids.length === 0
                      ? "border-error"
                      : "border-base-300"
                  }`}
                >
                  {service &&
                    service.map((s) => (
                      <label
                        key={s.id}
                        className="flex items-center gap-2 cursor-pointer hover:bg-base-200 rounded p-2"
                      >
                        <input
                          type="checkbox"
                          className="checkbox checkbox-sm checkbox-primary"
                          checked={data.service_ids.includes(String(s.id))}
                          onChange={() => handleSelectService(s.id)}
                        />
                        <span className="font-normal">
                          {s.service_name} : {s.size}
                        </span>
                      </label>
                    ))}
                </div>
                {data.service_ids.length > 0 && (
                  <span className="text-sm font-normal text-base-content/70">
                    {data.service_ids.length} selected
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2 font-semibold">
                <span className="w-32">Schedule</span>
                <div className="border rounded-lg overflow-hidden max-w-2xl">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Day</th>
                        <th>Start time</th>
                        <th>End time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {DAYS.map((day) => (
                        <tr key={day}>
                          <td className="font-normal">{day}</td>
                          <td>
                            <input
                              type="time"
                              className="input input-bordered input-sm w-full max-w-[8rem]"
                              value={data.schedule[day].start_time}
                              onChange={(e) =>
                                handleScheduleChange(
                                  day,
                                  "start_time",
                                  e.target.value,
                                )
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="time"
                              className="input input-bordered input-sm w-full max-w-[8rem]"
                              value={data.schedule[day].end_time}
                              onChange={(e) =>
                                handleScheduleChange(
                                  day,
                                  "end_time",
                                  e.target.value,
                                )
                              }
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                    setData({
                      service_ids: [],
                      channel_id: "",
                      schedule: initialSchedule,
                    });
                    setErrors("");
                    onBack?.();
                  }}
                >
                  CANCEL
                </button>
              </div>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default ChannelMatchingAddPage;
