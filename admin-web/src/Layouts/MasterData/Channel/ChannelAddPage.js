import React, { useEffect, useState } from "react";
import { GetAllBranch, PostAddChannel } from "../../Modules/Api";
import Notification from "../../Notification/Notification";

const ChannelAddPage = () => {
  const [branch, setBranch] = useState([]);
  const [errors, setErrors] = useState([]);
  const [notificationKey, setNotificationKey] = useState(0);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    status: "",
  });
  const [data, setData] = useState({
    name: "",
    max_capacity: "",
    branch_id: "",
  });

  useEffect(() => {
    GetAllBranch().then(({ status, msg }) => {
      if (status === "SUCCESS") {
        setBranch(msg);
      } else if (status === "NO DATA") {
        setBranch([]);
      }
    });
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    PostAddChannel(data).then(({ status, msg }) => {
      setNotification({
        show: true,
        status: status,
        message: msg,
      });
      if (status === "SUCCESS") {
        setErrors([]);
      } else if (status === "WARNING") {
        setErrors(msg);
        setData({ ...data, name: "", branch_id: "" });
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

      <form onSubmit={handleAdd}>
        {branch.length != 0 ? (
          <div className="border p-4 bg-base-100 space-y-4 items-center">
            {errors && <p className="text-red-500 text-md">{errors}</p>}
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
                  setData({
                    name: "",
                    max_capacity: "",
                    branch_id: "",
                  });
                  setErrors([]);
                }}
              >
                CANCEL
              </button>
            </div>
          </div>
        ) : (
          <p className="text-red-500 text-md">No Branch Available</p>
        )}
      </form>
    </div>
  );
};

export default ChannelAddPage;
