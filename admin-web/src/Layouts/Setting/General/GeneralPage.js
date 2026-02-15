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
    <div className="flex flex-col bg-white mx-auto p-5 rounded-lg shadow-xl h-full overflow-y-auto">
      {notification.show && (
        <Notification
          key={notificationKey}
          message={notification.message}
          status={notification.status}
        />
      )}

      <div className="text-4xl font-bold py-8 pl-6 border-b-2 border-gray-200">
        <div className="breadcrumbs">
          <ul>
            <li>{labelValue}</li>
            {isEditSettings ? (
              <li className="text-xl">GENERAL SETTINGS</li>
            ) : (
              <li className="text-xl">EDIT SETTINGS</li>
            )}
          </ul>
        </div>
      </div>

      <div className="flex gap-4 my-6">
        {actions.includes("edit") && (
          <button
            className={`btn btn-wide font-bold ${
              !isEditSettings ? "btn-primary" : "btn-outline"
            }`}
            onClick={handleEdit}
            disabled={!isEditSettings}
          >
            Edit
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col md:flex-row gap-2 md:items-center font-semibold">
          <span className="w-64">Staff failed login limit</span>
          <div className="flex items-center gap-2">
            <input
              name="staff_failed_login_limit"
              type="number"
              defaultValue={settings && settings.staff_failed_login_limit}
              disabled={isEditSettings}
              className="input input-bordered w-full max-w-md"
            />
            <span className="text-sm text-base-content/70">times</span>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-2 md:items-center font-semibold">
          <span className="w-64">Staff user login mins limit</span>
          <div className="flex items-center gap-2">
            <input
              name="staff_user_login_mins_limit"
              type="number"
              defaultValue={settings && settings.staff_user_login_mins_limit}
              disabled={isEditSettings}
              className="input input-bordered w-full max-w-md"
            />
            <span className="text-sm text-base-content/70">mins</span>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-2 md:items-center font-semibold">
          <span className="w-64">Staff inactive limit</span>
          <div className="flex items-center gap-2">
            <input
              name="staff_inactive_limit"
              type="number"
              defaultValue={settings && settings.staff_inactive_limit}
              disabled={isEditSettings}
              className="input input-bordered w-full max-w-md"
            />
            <span className="text-sm text-base-content/70">days</span>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-2 md:items-center font-semibold">
          <span className="w-64">Customer failed login limit</span>
          <div className="flex items-center gap-2">
            <input
              name="customer_failed_login_limit"
              type="number"
              defaultValue={settings && settings.customer_failed_login_limit}
              disabled={isEditSettings}
              className="input input-bordered w-full max-w-md"
            />
            <span className="text-sm text-base-content/70">times</span>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-2 md:items-center font-semibold">
          <span className="w-64">Customer user login mins limit</span>
          <div className="flex items-center gap-2">
            <input
              name="customer_user_login_mins_limit"
              type="number"
              defaultValue={settings && settings.customer_user_login_mins_limit}
              disabled={isEditSettings}
              className="input input-bordered w-full max-w-md"
            />
            <span className="text-sm text-base-content/70">mins</span>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-2 md:items-center font-semibold">
          <span className="w-64">Customer inactive limit</span>
          <div className="flex items-center gap-2">
            <input
              name="customer_inactive_limit"
              type="number"
              defaultValue={settings && settings.customer_inactive_limit}
              disabled={isEditSettings}
              className="input input-bordered w-full max-w-md"
            />
            <span className="text-sm text-base-content/70">days</span>
          </div>
        </div>

        {!isEditSettings && (
          <div className="flex gap-4 mt-6">
            <button type="submit" className="btn btn-primary font-bold">
              Submit
            </button>
            <button
              type="button"
              className="btn btn-outline font-bold"
              onClick={() => setIsEditSettings(true)}
            >
              Cancel
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default GeneralPage;
