import React, { useState } from "react";
import Notification from "../../Notification/Notification";
import { PostAddBranch } from "../../Modules/Api";

const BranchAddPage = () => {
  const [notificationKey, setNotificationKey] = useState(0);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    status: "",
  });
  const [data, setData] = useState({
    name: "",
    address: "",
    phone: "",
  });

  const handleAddService = (e) => {
    e.preventDefault();
    PostAddBranch(data).then(({ status, msg }) => {
      setNotification({
        show: true,
        status: status,
        message: msg,
      });
      setNotificationKey((prev) => prev + 1);
      if (status === "SUCCESS") {
        setData({
          name: "",
          address: "",
          phone: "",
        });
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
            <span className="w-32">Branch Name</span>
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
            <span className="w-32">Phone</span>
            <input
              type="tel"
              inputMode="numeric"
              value={data.phone}
              className={`input validator tabular-nums input-bordered w-full max-w-md ${
                !data.phone ? `input-error` : ``
              }`}
              onChange={(e) => {
                let value = e.target.value.replace(/[^0-9]/g, "");
                if (value.length > 10) {
                  value = value.slice(0, 10);
                }
                setData({ ...data, phone: value });
              }}
              required
            />
          </div>
          <div className="flex flex-col md:flex-row gap-2 md:items-center font-semibold">
            <span className="w-32">Address</span>
            <input
              type="text"
              value={data.address}
              className={`input input-bordered w-full max-w-md ${
                !data.address ? `input-error` : ``
              }`}
              onChange={(e) => {
                setData({ ...data, address: e.target.value });
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
                  address: "",
                  phone: "",
                });
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

export default BranchAddPage;
