import React, { useState } from "react";
import Notification from "../../Notification/Notification";
import { UpdateBranch } from "../../Modules/Api";

const BranchEditPage = ({ editItem, onBack, onSuccess }) => {
  const [data, setData] = useState({
    id: editItem.id,
    name: editItem.name,
    address: editItem.address,
    phone: editItem.phone,
  });
  const [errors, setErrors] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notificationKey, setNotificationKey] = useState(0);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    status: "",
  });

  const handleEditBranch = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    UpdateBranch(data).then(({ status, msg }) => {
      setIsSubmitting(false);
      if (status === "SUCCESS") {
        setErrors("");
        onSuccess?.(msg);
      } else {
        setNotification({ show: true, status, message: msg });
        setNotificationKey((prev) => prev + 1);
        if (status === "ERROR" || status === "WARNING") {
          setErrors(msg);
          setData({
            id: editItem.id,
            name: editItem.name,
            address: editItem.address,
            phone: editItem.phone,
          });
        }
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

      <form onSubmit={handleEditBranch} className="space-y-6">
        {/* Branch Info Card */}
        <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden">
          <div className="px-5 py-4 bg-base-200/50 border-b border-base-200">
            <h2 className="font-semibold text-base-content flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
              </svg>
              Branch Information
            </h2>
          </div>
          <div className="p-5 space-y-4">
            {errors && <p className="text-error text-sm">{errors}</p>}

            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="text-sm font-medium text-base-content/80 sm:w-32">
                Branch Name <span className="text-error">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter branch name"
                value={data.name}
                className="input input-bordered w-full max-w-xs"
                onChange={(e) => setData({ ...data, name: e.target.value })}
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="text-sm font-medium text-base-content/80 sm:w-32">
                Phone <span className="text-error">*</span>
              </label>
              <input
                type="tel"
                inputMode="numeric"
                placeholder="Enter phone number"
                value={data.phone}
                className="input input-bordered w-full max-w-xs tabular-nums"
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

            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="text-sm font-medium text-base-content/80 sm:w-32">
                Address <span className="text-error">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter address"
                value={data.address}
                className="input input-bordered w-full max-w-xs"
                onChange={(e) => setData({ ...data, address: e.target.value })}
                required
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-base-200">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              setData({
                id: editItem.id,
                name: editItem.name,
                address: editItem.address,
                phone: editItem.phone,
              });
              setErrors("");
              onBack?.();
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`btn btn-accent ${isSubmitting ? "loading" : ""}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BranchEditPage;
