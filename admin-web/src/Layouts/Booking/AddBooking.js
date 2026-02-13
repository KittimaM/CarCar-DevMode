import React, { useEffect, useState } from "react";
import { GetAvailableService } from "../Modules/Api";
import Notification from "../Notification/Notification";

const AddBooking = () => {
  const [service, setService] = useState([]);
  const [errors, setErrors] = useState(null);
  const [notificationKey, setNotificationKey] = useState(0);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    status: "",
  });
  const [data, setData] = useState({
    service_id: "",
  });

  useEffect(() => {

  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
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
      {!errors ? (
        <form onSubmit={handleAdd}>
          <div className="border p-4 bg-base-100 space-y-4 items-center">
            <div className="flex flex-col md:flex-row gap-2 md:items-center font-semibold">
              <span className="w-32">Service</span>
              <select
                value={data.service_id}
                className={`select select-bordered w-full max-w-md ${
                  !data.service_id ? `select-error` : ``
                }`}
                onChange={(e) => {
                  setData({ ...data, service_id: e.target.value });
                }}
                required
              >
                <option disabled={true} value="">
                  Pick A Service
                </option>
                {service.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            {data.service_id && (
              <div className="flex flex-col md:flex-row gap-2 md:items-center font-semibold">
                <span className="w-32">Service</span>
                <select
                  value={data.service_id}
                  className={`select select-bordered w-full max-w-md ${
                    !data.service_id ? `select-error` : ``
                  }`}
                  onChange={(e) => {
                    setData({ ...data, service_id: e.target.value });
                  }}
                  required
                >
                  <option disabled={true} value="">
                    Pick A Service
                  </option>
                  {service.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="flex gap-2 mt-4">
              <button type="submit" className="btn btn-success text-white">
                SUBMIT
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => {
                  setData({
                    service_id: "",
                    date: "",
                    time: "",
                    staff_id: "",
                    staff_ids: [],
                    status: "",
                    notes: "",
                  });
                  setErrors(null);
                }}
              >
                CANCEL
              </button>
            </div>
          </div>
        </form>
      ) : (
        <p className="text-red-500 text-md">{errors}</p>
      )}
    </div>
  );
};

export default AddBooking;
