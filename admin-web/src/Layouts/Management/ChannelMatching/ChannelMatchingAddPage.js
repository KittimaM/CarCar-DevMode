import React, { useState, useEffect } from "react";
import Notification from "../../Notification/Notification";
import {
  GetAllChannel,
  GetAllServiceRates,
  PostAddChannelMatching,
} from "../../Modules/Api";

const CustomCheckbox = ({ checked, onChange }) => (
  <label className="relative cursor-pointer flex-shrink-0">
    <input
      type="checkbox"
      className="sr-only"
      checked={checked}
      onChange={onChange}
    />
    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
      checked 
        ? "bg-success border-success" 
        : "bg-base-100 border-base-300 hover:border-success"
    }`}>
      {checked && (
        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
    </div>
  </label>
);

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
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    setIsSubmitting(true);
    PostAddChannelMatching(data).then(({ status, msg }) => {
      setIsSubmitting(false);
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
    <div className="max-w-3xl mx-auto">
      {notification.show && (
        <Notification
          key={notificationKey}
          message={notification.message}
          status={notification.status}
        />
      )}

      <form onSubmit={handleAdd} className="space-y-6">
        {/* Channel Info Card */}
        <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden">
          <div className="px-5 py-4 bg-base-200/50 border-b border-base-200">
            <h2 className="font-semibold text-base-content flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
              </svg>
              Channel Information
            </h2>
          </div>
          <div className="p-5 space-y-4">
            {errors && <p className="text-error text-sm">{errors}</p>}
            
            {service.length > 0 && channel.length > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label className="text-sm font-medium text-base-content/80 sm:w-32">
                  Channel <span className="text-error">*</span>
                </label>
                <select
                  value={data.channel_id}
                  className="select select-bordered w-full max-w-xs"
                  onChange={(e) => setData({ ...data, channel_id: e.target.value })}
                  required
                >
                  <option disabled value="">Pick a channel</option>
                  {channel.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Services Card */}
        {service.length > 0 && channel.length > 0 && (
          <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden">
            <div className="px-5 py-4 bg-base-200/50 border-b border-base-200">
              <h2 className="font-semibold text-base-content flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                Services
                {data.service_ids.length > 0 && (
                  <span className="badge badge-primary badge-sm ml-2">{data.service_ids.length} selected</span>
                )}
              </h2>
            </div>
            <div className="p-5">
              <div className={`border rounded-lg p-3 max-h-64 overflow-y-auto space-y-1 ${
                data.service_ids.length === 0 ? "border-error" : "border-base-300"
              }`}>
                {service.map((s) => (
                  <div
                    key={s.id}
                    className="flex items-center gap-3 hover:bg-base-200/30 rounded-lg p-2 transition-colors"
                  >
                    <CustomCheckbox
                      checked={data.service_ids.includes(String(s.id))}
                      onChange={() => handleSelectService(s.id)}
                    />
                    <span className="text-sm text-base-content">{s.service_name} : {s.size}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Schedule Card */}
        {service.length > 0 && channel.length > 0 && (
          <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden">
            <div className="px-5 py-4 bg-base-200/50 border-b border-base-200">
              <h2 className="font-semibold text-base-content flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                Weekly Schedule
              </h2>
            </div>
            <div className="p-5">
              <div className="overflow-x-auto">
                <table className="table table-sm">
                  <thead>
                    <tr className="bg-base-200/30">
                      <th className="font-semibold">Day</th>
                      <th className="font-semibold">Start Time</th>
                      <th className="font-semibold">End Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DAYS.map((day) => (
                      <tr key={day} className="hover:bg-base-50">
                        <td className="font-medium">{day}</td>
                        <td>
                          <input
                            type="time"
                            className="input input-bordered input-sm w-full max-w-[8rem]"
                            value={data.schedule[day].start_time}
                            onChange={(e) => handleScheduleChange(day, "start_time", e.target.value)}
                          />
                        </td>
                        <td>
                          <input
                            type="time"
                            className="input input-bordered input-sm w-full max-w-[8rem]"
                            value={data.schedule[day].end_time}
                            onChange={(e) => handleScheduleChange(day, "end_time", e.target.value)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        {service.length > 0 && channel.length > 0 && (
          <div className="flex justify-end gap-3 pt-4 border-t border-base-200">
            <button
              type="button"
              className="btn btn-ghost"
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
              Cancel
            </button>
            <button
              type="submit"
              className={`btn btn-primary ${isSubmitting ? "loading" : ""}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Channel Matching"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ChannelMatchingAddPage;
