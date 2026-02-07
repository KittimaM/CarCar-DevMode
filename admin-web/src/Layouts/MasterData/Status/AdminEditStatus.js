import React, { useState } from "react";
import Notification from "../../Notification/Notification";
import { UpdateStatus } from "../../Modules/Api";

const AdminEditStatus = ({ editItem }) => {
  const [data, setData] = useState(editItem);
  const [errors, setErrors] = useState([]);
  const [notificationKey, setNotificationKey] = useState(0);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    status: "",
  });

  const handleEdit = (e) => {
    e.preventDefault();
    UpdateStatus(data).then(({ status, msg }) => {
      if (status === "SUCCESS") {
        setNotification({
          show: true,
          status: status,
          message: data.code + " " + msg,
        });
        setErrors([]);
      } else if (status === "WARNING") {
        setErrors(msg);
        setData({ ...data, code: editItem.code });
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
            <span className="w-32">Status Code</span>
            <input
              type="text"
              value={data.code}
              className={`input input-bordered w-full max-w-md ${
                !data.code ? `input-error` : ``
              }`}
              onChange={(e) => {
                setData({ ...data, code: e.target.value });
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
                setErrors([]);
                setData(editItem);
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

export default AdminEditStatus;
