import React, { useEffect, useState } from "react";
import { GetAdminGeneral, UpdateAdminGeneral } from "../../Modules/Api";
import Notification from "../../Notification/Notification";

const GeneralPage = ({ data }) => {
  const { labelValue, permission, code } = data;
  const actions = permission.find((p) => p.code === code).permission_actions;
  const [settings, setSettings] = useState();
  const [isEditSettings, setIsEditSettings] = useState(true);
  const [notificationKey, setNotificationKey] = useState(0);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    status: "",
  });

  useEffect(() => {
    GetAdminGeneral().then((data) => {
      const { status, msg } = data;
      if (status === "SUCCESS") {
        setSettings(msg[0]);
      } else {
        console.log(data);
      }
    });
  }, []);

  const handleEdit = () => {
    setIsEditSettings(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const jsonData = {
      staff_failed_login_limit: formData.get("staff_failed_login_limit"),
      staff_user_login_mins_limit: formData.get("staff_user_login_mins_limit"),
      staff_inactive_limit: formData.get("staff_inactive_limit"),
      customer_failed_login_limit: formData.get("customer_failed_login_limit"),
      customer_user_login_mins_limit: formData.get(
        "customer_user_login_mins_limit"
      ),
      customer_inactive_limit: formData.get("customer_inactive_limit"),
    };
    UpdateAdminGeneral(jsonData).then((res) => {
      const { status, msg } = res;
      if (status === "SUCCESS") {
        setIsEditSettings(true);
        setNotification({ show: true, message: msg, status });
      } else {
        setNotification({ show: true, message: msg || "Update failed", status: "ERROR" });
      }
      setNotificationKey((prev) => prev + 1);
    });
  };

  return (
    <div className="flex flex-col h-full bg-base-100">
      {notification.show && (
        <Notification
          key={notificationKey}
          message={notification.message}
          status={notification.status}
        />
      )}

      <div className="px-8 py-8 shadow-md bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-base-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">{labelValue}</p>
            <h1 className="text-3xl font-bold text-base-content">
              {isEditSettings ? "General Settings" : "Edit Settings"}
            </h1>
          </div>

          {actions.includes("edit") && isEditSettings && (
            <button
              className="btn btn-primary  gap-2 shadow-md"
              onClick={handleEdit}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit Settings
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
          <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden">
            <div className="px-5 py-4 bg-base-200/50 border-b border-base-200">
              <h2 className="font-semibold text-base-content flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                Staff Settings
              </h2>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label className="text-sm font-medium text-base-content/80 sm:w-56">Failed login limit</label>
                <div className="flex items-center gap-2 flex-1">
                  <input
                    name="staff_failed_login_limit"
                    type="number"
                    defaultValue={settings?.staff_failed_login_limit}
                    disabled={isEditSettings}
                    className="input input-bordered input-sm w-24"
                  />
                  <span className="text-sm text-base-content/60">times</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label className="text-sm font-medium text-base-content/80 sm:w-56">Login session limit</label>
                <div className="flex items-center gap-2 flex-1">
                  <input
                    name="staff_user_login_mins_limit"
                    type="number"
                    defaultValue={settings?.staff_user_login_mins_limit}
                    disabled={isEditSettings}
                    className="input input-bordered input-sm w-24"
                  />
                  <span className="text-sm text-base-content/60">minutes</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label className="text-sm font-medium text-base-content/80 sm:w-56">Inactive account limit</label>
                <div className="flex items-center gap-2 flex-1">
                  <input
                    name="staff_inactive_limit"
                    type="number"
                    defaultValue={settings?.staff_inactive_limit}
                    disabled={isEditSettings}
                    className="input input-bordered input-sm w-24"
                  />
                  <span className="text-sm text-base-content/60">days</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden">
            <div className="px-5 py-4 bg-base-200/50 border-b border-base-200">
              <h2 className="font-semibold text-base-content flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                Customer Settings
              </h2>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label className="text-sm font-medium text-base-content/80 sm:w-56">Failed login limit</label>
                <div className="flex items-center gap-2 flex-1">
                  <input
                    name="customer_failed_login_limit"
                    type="number"
                    defaultValue={settings?.customer_failed_login_limit}
                    disabled={isEditSettings}
                    className="input input-bordered input-sm w-24"
                  />
                  <span className="text-sm text-base-content/60">times</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label className="text-sm font-medium text-base-content/80 sm:w-56">Login session limit</label>
                <div className="flex items-center gap-2 flex-1">
                  <input
                    name="customer_user_login_mins_limit"
                    type="number"
                    defaultValue={settings?.customer_user_login_mins_limit}
                    disabled={isEditSettings}
                    className="input input-bordered input-sm w-24"
                  />
                  <span className="text-sm text-base-content/60">minutes</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label className="text-sm font-medium text-base-content/80 sm:w-56">Inactive account limit</label>
                <div className="flex items-center gap-2 flex-1">
                  <input
                    name="customer_inactive_limit"
                    type="number"
                    defaultValue={settings?.customer_inactive_limit}
                    disabled={isEditSettings}
                    className="input input-bordered input-sm w-24"
                  />
                  <span className="text-sm text-base-content/60">days</span>
                </div>
              </div>
            </div>
          </div>

          {!isEditSettings && (
            <div className="flex justify-end gap-3 pt-4 border-t border-base-200">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setIsEditSettings(true)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default GeneralPage;
