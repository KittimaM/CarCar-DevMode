import React, { useEffect, useState } from "react";
import Notification from "../../Notification/Notification";
import { GetAllStatusGroup, UpdateStatus } from "../../Modules/Api";

const StatusEditPage = ({ editItem, onBack, onSuccess }) => {
  const [data, setData] = useState({ ...editItem });
  const [statusGroup, setStatusGroup] = useState([]);
  const [errors, setErrors] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notificationKey, setNotificationKey] = useState(0);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    status: "",
  });

  useEffect(() => {
    GetAllStatusGroup().then(({ status, msg }) => {
      if (status === "SUCCESS") {
        setStatusGroup(msg);
      } else {
        setStatusGroup([]);
        setErrors("No status groups available");
      }
    });
  }, []);

  const handleEdit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    UpdateStatus(data).then(({ status, msg }) => {
      setIsSubmitting(false);
      if (status === "SUCCESS") {
        setErrors("");
        onSuccess?.(msg);
      } else {
        setNotification({ show: true, status, message: msg });
        setNotificationKey((prev) => prev + 1);
        if (status === "WARNING") {
          setErrors(msg);
          setData({ ...data, code: editItem.code });
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
        {/* Status Info Card */}
        <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden">
          <div className="px-5 py-4 bg-base-200/50 border-b border-base-200">
            <h2 className="font-semibold text-base-content flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              Status Information
            </h2>
          </div>
          <div className="p-5 space-y-4">
            {errors && <p className="text-error text-sm">{errors}</p>}

            {statusGroup.length > 0 && (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <label className="text-sm font-medium text-base-content/80 sm:w-32">
                    Status Group <span className="text-error">*</span>
                  </label>
                  <select
                    value={data.status_group_id}
                    className="select select-bordered w-full max-w-xs"
                    onChange={(e) => setData({ ...data, status_group_id: e.target.value })}
                    required
                  >
                    <option disabled value="">Pick a status group</option>
                    {statusGroup.map((sg) => (
                      <option key={sg.id} value={sg.id}>{sg.code}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <label className="text-sm font-medium text-base-content/80 sm:w-32">
                    Status Code <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter status code"
                    value={data.code}
                    className="input input-bordered w-full max-w-xs"
                    onChange={(e) => setData({ ...data, code: e.target.value })}
                    required
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        {statusGroup.length > 0 && (
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
        )}
      </form>
    </div>
  );
};

export default StatusEditPage;
