import { useEffect, useState } from "react";
import {
  GetAllAdminRole,
  UpdateStaffUser,
  GetAllBranch,
} from "../../Modules/Api";
import Notification from "../../Notification/Notification";

const StaffEditPage = ({ editItem, onBack, onSuccess }) => {
  const [branch, setBranch] = useState([]);
  const [roleList, setRoleList] = useState([]);
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

  useEffect(() => {
    GetAllAdminRole().then(({ status, msg }) => {
      if (status === "SUCCESS") {
        setRoleList(msg);
      }
    });
    GetAllBranch().then(({ status, msg }) => {
      if (status === "SUCCESS") {
        setBranch(msg);
      }
    });
  }, []);

  const handleEdit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    UpdateStaffUser(data).then(({ status, msg }) => {
      setIsSubmitting(false);
      if (status === "SUCCESS") {
        setErrors([]);
        onSuccess?.(msg);
      } else if (status === "WARNING") {
        setErrors(msg);
        setData({ ...data, username: editItem.username });
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

      <form onSubmit={handleEdit} className="space-y-6">
        {/* Account Info Card */}
        <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden">
          <div className="px-5 py-4 bg-base-200/50 border-b border-base-200">
            <h2 className="font-semibold text-base-content flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              Account Information
            </h2>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="text-sm font-medium text-base-content/80 sm:w-32">
                Username <span className="text-error">*</span>
              </label>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Enter username"
                  value={data.username}
                  className="input input-bordered w-full max-w-xs"
                  onChange={(e) => {
                    setData({ ...data, username: e.target.value });
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
                  setData({ ...data, name: e.target.value });
                }}
                required
              />
            </div>
          </div>
        </div>

        {/* Password Card */}
        <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden">
          <div className="px-5 py-4 bg-base-200/50 border-b border-base-200">
            <h2 className="font-semibold text-base-content flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-warning" viewBox="0 0 20 20" fill="currentColor">
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
                className="checkbox checkbox-sm checkbox-secondary"
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

        {/* Role & Branch Card */}
        <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden">
          <div className="px-5 py-4 bg-base-200/50 border-b border-base-200">
            <h2 className="font-semibold text-base-content flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
              </svg>
              Role & Assignment
            </h2>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="text-sm font-medium text-base-content/80 sm:w-32">
                Role <span className="text-error">*</span>
              </label>
              <select
                value={data.role_id}
                className="select select-bordered w-full max-w-xs"
                onChange={(e) => setData({ ...data, role_id: e.target.value })}
                required
              >
                <option disabled value="">
                  Select a role
                </option>
                {roleList &&
                  roleList.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
              </select>
            </div>

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
                <option disabled value="">
                  Select a branch
                </option>
                {branch &&
                  branch.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
              </select>
            </div>
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
            className={`btn btn-secondary ${isSubmitting ? "loading" : ""}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StaffEditPage;
