import React, { useState } from "react";
import { UpdateAdminCustomer } from "../../Modules/Api";
import Notification from "../../Notification/Notification";

const CustomerEditPage = ({ editItem, onBack, onSuccess }) => {
  const [errors, setErrors] = useState([]);
  const [notificationKey, setNotificationKey] = useState(0);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    status: "",
  });
  const [data, setData] = useState({
    ...editItem,
    password: "",
    isChangePassword: false,
  });

  const handleEditUser = (e) => {
    e.preventDefault();
    UpdateAdminCustomer(data).then(({ status, msg }) => {
      if (status === "SUCCESS") {
        setErrors([]);
        onSuccess?.(msg);
      } else if (status === "WARNING") {
        setErrors(msg);
        setData({ ...data, phone: editItem.phone });
        setNotification({ show: true, status, message: msg });
        setNotificationKey((prev) => prev + 1);
      } else {
        setNotification({ show: true, status, message: msg });
        setNotificationKey((prev) => prev + 1);
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
      <form onSubmit={handleEditUser}>
        <div className="border p-4 bg-base-100 space-y-4 items-center">
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
          {errors && <p className="text-red-500 text-md">{errors}</p>}
          <div className="flex flex-col md:flex-row gap-2 md:items-center font-semibold">
            <span className="w-32">Name</span>
            <input
              type="text"
              value={data.name}
              className={`input input-bordered w-full max-w-md ${
                !data.name ? `input-error` : ``
              }`}
              onChange={(e) => {
                const onlyLetters = e.target.value.replace(/[^A-Za-z ]/g, "");
                setData({ ...data, name: onlyLetters });
              }}
              required
            />
          </div>

          <div className="flex flex-col md:flex-row gap-2 md:items-center font-semibold">
            <input
              type="checkbox"
              checked={!data.isChangePassword}
              className="checkbox checkbox-success"
              onChange={() =>
                setData({ ...data, isChangePassword: !data.isChangePassword })
              }
            />

            {!data.isChangePassword ? (
              <span>use same password</span>
            ) : (
              <>
                <span className="w-32">Password</span>
                <input
                  type="password"
                  value={data.password}
                  className={`input input-bordered w-full max-w-md ${
                    !data.password ? `input-error` : ``
                  }`}
                  onChange={(e) => {
                    setData({ ...data, password: e.target.value });
                  }}
                  required
                />
              </>
            )}
          </div>

          <div className="flex gap-2 mt-4">
            <button type="submit" className="btn btn-success text-white">
              SUBMIT
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => onBack?.()}
            >
              CANCEL
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CustomerEditPage;
