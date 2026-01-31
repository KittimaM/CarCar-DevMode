import React, { useEffect, useState } from "react";
import Notification from "../../Notification/Notification";
import { GetAvailableService, UpdateChannel } from "../../Api";
import Select from "react-select";

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
    description: editItem.description,
    is_available: editItem.is_available,
    service_ids: editItem.services.map((service) => service.service_id),
  });

  useEffect(() => {
    GetAvailableService().then(({ status, msg }) => {
      if (status === "SUCCESS") {
        setService(
          msg.map((service) => {
            return { value: service.id, label: service.service };
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

  const handleReset = () => {
    setData({
      id: editItem.id,
      name: editItem.name,
      description: editItem.description,
      is_available: editItem.is_available,
      service_ids: editItem.services.map((service) => service.service_id),
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
                  data.service_ids.includes(option.value)
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
            <span className="w-32 flex flex-col leading-tight">
              <span>Description</span>
              <span className="text-xs text-success">(optional)</span>
            </span>
            <input
              type="text"
              value={data.description || ""}
              className="input input-bordered w-full max-w-md"
              onChange={(e) => {
                setData({ ...data, description: e.target.value });
              }}
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

export default AdminEditChannel;
