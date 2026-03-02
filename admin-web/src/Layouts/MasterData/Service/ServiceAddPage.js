import React, { useState } from "react";
import { PostAddService } from "../../Modules/Api";
import Notification from "../../Notification/Notification";

const ServiceAddPage = ({ onSuccess, onBack }) => {
  const [data, setData] = useState({
    name: "",
  });
  const [errors, setErrors] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notificationKey, setNotificationKey] = useState(0);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    status: "",
  });

  const handleAdd = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    PostAddService(data).then(({ status, msg }) => {
      setIsSubmitting(false);
      if (status === "SUCCESS") {
        setErrors("");
        onSuccess?.(msg);
      } else {
        setNotification({ show: true, status, message: msg });
        setNotificationKey((prev) => prev + 1);
        if (status === "WARNING") {
          setErrors(msg);
          setData({ name: "" });
        } else if (status === "ERROR") {
          setErrors(msg);
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

      <form onSubmit={handleAdd} className="space-y-6">
        {/* Service Info Card */}
        <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden">
          <div className="px-5 py-4 bg-base-200/50 border-b border-base-200">
            <h2 className="font-semibold text-base-content flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              Service Information
            </h2>
          </div>
          <div className="p-5 space-y-4">
            {errors && <p className="text-error text-sm">{errors}</p>}

            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="text-sm font-medium text-base-content/80 sm:w-32">
                Service Name <span className="text-error">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter service name"
                value={data.name}
                className="input input-bordered w-full max-w-xs"
                onChange={(e) => setData({ ...data, name: e.target.value })}
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
              setData({ name: "" });
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
            {isSubmitting ? "Creating..." : "Create Service"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceAddPage;
