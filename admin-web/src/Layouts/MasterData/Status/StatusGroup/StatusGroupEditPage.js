import React, { useState } from "react";
import Notification from "../../../Notification/Notification";
import { UpdateStatusGroup } from "../../../Modules/Api";

const StatusGroupEditPage = ({ editItem, onBack, onSuccess }) => {
  const [data, setData] = useState({ ...editItem });
  const [errors, setErrors] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notificationKey, setNotificationKey] = useState(0);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    status: "",
  });

  const handleEdit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    UpdateStatusGroup(data).then(({ status, msg }) => {
      setIsSubmitting(false);
      if (status === "SUCCESS") {
        setErrors("");
        onSuccess?.(data.code + " " + msg);
      } else {
        setNotification({ show: true, status, message: data.code + " " + msg });
        setNotificationKey((prev) => prev + 1);
        if (status === "WARNING") {
          setErrors(msg);
          setData({ ...editItem });
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

      <form onSubmit={handleEdit} className="space-y-6">
        {/* Status Group Info Card */}
        <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden">
          <div className="px-5 py-4 bg-base-200/50 border-b border-base-200">
            <h2 className="font-semibold text-base-content flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
              </svg>
              Status Group Information
            </h2>
          </div>
          <div className="p-5 space-y-4">
            {errors && <p className="text-error text-sm">{errors}</p>}

            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="text-sm font-medium text-base-content/80 sm:w-32">
                Group Code <span className="text-error">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter status group code"
                value={data.code}
                className="input input-bordered w-full max-w-xs"
                onChange={(e) => setData({ ...data, code: e.target.value })}
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
              setData({ ...editItem });
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

export default StatusGroupEditPage;
