import React, { useState } from "react";
import { PostAddService } from "../../Modules/Api";
import Notification from "../../Notification/Notification";

const AdminAddService = () => {
  const [errors, setErrors] = useState([]);
  const [notificationKey, setNotificationKey] = useState(0);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    status: "",
  });
  const [data, setData] = useState({
    name: "",
  });

  const handleAddService = (e) => {
    e.preventDefault();
    PostAddService(data).then(({ status, msg }) => {
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
        setData({ name: "" });
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
          <div className="flex gap-2 mt-4">
            <button type="submit" className="btn btn-success text-white">
              SUBMIT
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => {
                setData({
                  name: "",
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

export default AdminAddService;
