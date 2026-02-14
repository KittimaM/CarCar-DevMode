import React, { useEffect, useState } from "react";
import Notification from "../../Notification/Notification";
import { GetAvailableBranch, UpdateChannel } from "../../Modules/Api";

const AdminEditChannel = ({ editItem }) => {
  const [data, setData] = useState({ ...editItem });
  const [branch, setBranch] = useState([]);
  const [errors, setErrors] = useState([]);
  const [notificationKey, setNotificationKey] = useState(0);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    status: "",
  });

  useEffect(() => {
    GetAvailableBranch().then(({ status, msg }) => {
      if (status === "SUCCESS") {
        setBranch(msg);
      } else if (status === "NO DATA") {
        setBranch([]);
        setErrors(msg);
      }
    });
  }, []);

  const handleEdit = (e) => {
    e.preventDefault();
    UpdateChannel(data).then(({ status, msg }) => {
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
        setData({ ...editItem });
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

      <form onSubmit={handleEdit}>
        {errors && <p className="text-red-500 text-md">{errors}</p>}
        {branch.length != 0 && (
          <div className="border p-4 bg-base-100 space-y-4 items-center">
            <div className="flex flex-col md:flex-row gap-2 md:items-center font-semibold">
              <span className="w-32">Branch</span>
              <select
                value={data.branch_id}
                className={`select w-full select-bordered max-w-md ${
                  !data.branch_id ? `select-error` : ``
                }`}
                onChange={(e) =>
                  setData({ ...data, branch_id: e.target.value })
                }
                required
              >
                <option disabled={true} value="">
                  Pick A Branch
                </option>
                {branch &&
                  branch.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex flex-col md:flex-row gap-2 md:items-center font-semibold">
              <span className="w-32">Channel Name</span>
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

            <div className="flex gap-2 mt-4">
              <button type="submit" className="btn btn-success text-white">
                SUBMIT
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => {
                  setData({ ...editItem });
                  setErrors([]);
                }}
              >
                CANCEL
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default AdminEditChannel;
