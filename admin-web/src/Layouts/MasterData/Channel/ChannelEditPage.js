import React, { useEffect, useState } from "react";
import Notification from "../../Notification/Notification";
import { GetAllBranch, UpdateChannel } from "../../Modules/Api";

const ChannelEditPage = ({ editItem, onBack, onSuccess }) => {
  const [data, setData] = useState({
    ...editItem,
    booking_mode: editItem.booking_mode || "BOTH",
  });
  const [branch, setBranch] = useState([]);
  const [errors, setErrors] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notificationKey, setNotificationKey] = useState(0);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    status: "",
  });

  useEffect(() => {
    GetAllBranch().then(({ status, msg }) => {
      if (status === "SUCCESS") {
        setBranch(msg);
      } else if (status === "NO DATA") {
        setBranch([]);
        setErrors("No branches available");
      }
    });
  }, []);

  const handleEdit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    UpdateChannel(data).then(({ status, msg }) => {
      setIsSubmitting(false);
      if (status === "SUCCESS") {
        setErrors("");
        onSuccess?.(msg);
      } else {
        setNotification({
          show: true,
          status: status,
          message: msg,
        });
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
        {/* Channel Info Card */}
        <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden">
          <div className="px-5 py-4 bg-base-200/50 border-b border-base-200">
            <h2 className="font-semibold text-base-content flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
              </svg>
              Channel Information
            </h2>
          </div>
          <div className="p-5 space-y-4">
            {errors && <p className="text-error text-sm">{errors}</p>}

            {branch.length > 0 && (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <label className="text-sm font-medium text-base-content/80 sm:w-32">
                    Branch <span className="text-error">*</span>
                  </label>
                  <select
                    value={data.branch_id}
                    className="select select-bordered w-full max-w-xs"
                    onChange={(e) => setData({ ...data, branch_id: e.target.value })}
                    required
                  >
                    <option disabled value="">Pick a branch</option>
                    {branch.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <label className="text-sm font-medium text-base-content/80 sm:w-32">
                    Channel Name <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter channel name"
                    value={data.name}
                    className="input input-bordered w-full max-w-xs"
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                    required
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <label className="text-sm font-medium text-base-content/80 sm:w-32">
                    Max Capacity <span className="text-error">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Enter max capacity"
                    value={data.max_capacity}
                    className="input input-bordered w-full max-w-xs"
                    onChange={(e) => setData({ ...data, max_capacity: e.target.value })}
                    required
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <label className="text-sm font-medium text-base-content/80 sm:w-32">
                    Booking Type <span className="text-error">*</span>
                  </label>
                  <select
                    value={data.booking_mode}
                    className="select select-bordered w-full max-w-xs"
                    onChange={(e) => setData({ ...data, booking_mode: e.target.value })}
                    required
                  >
                    <option value="BOOKING_ONLY">จองล่วงหน้าเท่านั้น</option>
                    <option value="WALK_IN_ONLY">รับ Walk-in เท่านั้น</option>
                    <option value="BOTH">ได้ทั้งจองล่วงหน้าและ Walk-in</option>
                  </select>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        {branch.length > 0 && (
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

export default ChannelEditPage;
