import React, { useEffect, useState } from "react";
import Notification from "../../Notification/Notification";
import { GetAllStatusGroup, UpdateStatus } from "../../Modules/Api";

const StatusEditPage = ({ editItem, onBack, onSuccess }) => {
  const [data, setData] = useState(editItem);
  const [errors, setErrors] = useState([]);
  const [statusGroup, setStatusGroup] = useState([]);
  const [notificationKey, setNotificationKey] = useState(0);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    status: "",
  });

  const fetchStatusGroup = () => {
    GetAllStatusGroup().then(({ status, msg }) => {
      if (status === "SUCCESS") {
        setStatusGroup(msg);
      } else {
        setStatusGroup([]);
      }
    });
  };

  useEffect(() => {
    fetchStatusGroup();
  }, []);

  const handleEdit = (e) => {
    e.preventDefault();
    UpdateStatus(data).then(({ status, msg }) => {
      if (status === "SUCCESS") {
        setErrors([]);
        onSuccess?.(msg);
      } else {
        setNotification({ show: true, status, message: msg });
        setNotificationKey((prev) => prev + 1);
        if (status === "WARNING") { setErrors(msg); setData({ ...data, code: editItem.code }); }
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
        <div className="border p-4 bg-base-100 space-y-4 items-center">
          <div className="flex flex-col md:flex-row gap-2 md:items-center font-semibold">
            <span className="w-32">Status Group</span>
            <select
              value={data.status_group_id}
              className={`select w-full select-bordered max-w-md ${
                !data.status_group_id ? `select-error` : ``
              }`}
              onChange={(e) =>
                setData({ ...data, status_group_id: e.target.value })
              }
              required
            >
              <option disabled={true} value="">
                Pick A Status Group
              </option>
              {statusGroup &&
                statusGroup.map((sg) => (
                  <option key={sg.id} value={sg.id}>
                    {sg.code}
                  </option>
                ))}
            </select>
          </div>
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
              onClick={() => { setErrors([]); setData(editItem); onBack?.(); }}
            >
              CANCEL
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default StatusEditPage;
