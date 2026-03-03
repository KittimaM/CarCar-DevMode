import React, { useState } from "react";
import { UpdateAdminCustomer } from "../../Modules/Api";
import Notification from "../../Notification/Notification";

const CustomerEditPage = ({ editItem, onBack, onSuccess }) => {
  const [errors, setErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    setIsSubmitting(true);
    UpdateAdminCustomer(data).then(({ status, msg }) => {
      setIsSubmitting(false);
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
    <div className="max-w-3xl mx-auto">
      {notification.show && (
        <Notification
          key={notificationKey}
          message={notification.message}
          status={notification.status}
        />
      )}

      <form onSubmit={handleEditUser} className="space-y-6">
        {/* Customer Info Card */}
        <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden">
          <div className="px-5 py-4 bg-base-200/50 border-b border-base-200">
            <h2 className="font-semibold text-base-content flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              Customer Information
            </h2>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="text-sm font-medium text-base-content/80 sm:w-32">
                Phone <span className="text-error">*</span>
              </label>
              <div className="flex-1">
                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="Enter phone number"
                  value={data.phone}
                  className="input input-bordered w-full max-w-xs"
                  onChange={(e) => {
                    let value = e.target.value.replace(/[^0-9]/g, "");
                    if (value.length > 10) {
                      value = value.slice(0, 10);
                    }
                    setData({ ...data, phone: value });
                  }}
                  required
                />
                {errors && <p className="text-error text-sm mt-1">{errors}</p>}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="text-sm font-medium text-base-content/80 sm:w-32">
                Name <span className="text-error">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter full name"
                value={data.name}
                className="input input-bordered w-full max-w-xs"
                onChange={(e) => {
                  const onlyLetters = e.target.value.replace(/[^A-Za-z ]/g, "");
                  setData({ ...data, name: onlyLetters });
                }}
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="text-sm font-medium text-base-content/80 sm:w-32">Email</label>
              <input
                type="email"
                placeholder="Enter email (optional)"
                value={data.email || ""}
                className="input input-bordered w-full max-w-xs"
                onChange={(e) => setData({ ...data, email: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Password Card */}
        <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden">
          <div className="px-5 py-4 bg-base-200/50 border-b border-base-200">
            <h2 className="font-semibold text-base-content flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Password Settings
            </h2>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={data.isChangePassword}
                className="checkbox checkbox-sm checkbox-primary"
                onChange={() =>
                  setData({ ...data, isChangePassword: !data.isChangePassword })
                }
              />
              <label className="text-sm font-medium text-base-content/80">Change password</label>
            </div>

            {data.isChangePassword && (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 pl-7">
                <label className="text-sm font-medium text-base-content/80 sm:w-32">
                  New Password <span className="text-error">*</span>
                </label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={data.password}
                  className="input input-bordered w-full max-w-xs"
                  onChange={(e) => {
                    setData({ ...data, password: e.target.value });
                  }}
                  required={data.isChangePassword}
                />
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-base-200">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => onBack?.()}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`btn btn-primary ${isSubmitting ? "loading" : ""}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerEditPage;
