import React, { useEffect, useState } from "react";
import { GetAdminAdvanceSetting, UpdateAdminAdvanceSetting } from "../Api";

const AdminAdvanceSetting = ({ data }) => {
  const { labelValue, permission } = data;
  const [settings, setSettings] = useState();
  const [isEditSettings, setIsEditSettings] = useState(true);

  useEffect(() => {
    GetAdminAdvanceSetting().then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
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
    const data = new FormData(event.currentTarget);
    const jsonData = {
      staff_failed_login_limit: data.get("staff_failed_login_limit"),
      staff_user_login_mins_limit: data.get("staff_user_login_mins_limit"),
      staff_inactive_limit: data.get("staff_inactive_limit"),
      customer_failed_login_limit: data.get("customer_failed_login_limit"),
      customer_user_login_mins_limit: data.get(
        "customer_user_login_mins_limit"
      ),
      customer_inactive_limit: data.get("customer_inactive_limit"),
    };
    UpdateAdminAdvanceSetting(jsonData).then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        setIsEditSettings(true);
      } else {
        console.log(data);
      }
    });
  };
  return (
    <div className="flex flex-col bg-[#ffffff] mx-auto p-5 rounded-lg shadow-lg h-full overflow-y-auto">
      <div>
        <h1 className="flex justify-start items-center text-4xl font-bold py-10 pl-10 border-b-2 border-[#e5e5e5]">
          {labelValue}
        </h1>
      </div>
      
      <button className="btn" onClick={handleEdit} disabled={!isEditSettings}>
        edit
      </button>
      <form onSubmit={handleSubmit}>
        <div>
          <label>staff_failed_login_limit</label>
          <input
            name="staff_failed_login_limit"
            type="number"
            defaultValue={settings && settings.staff_failed_login_limit}
            disabled={isEditSettings}
          />
          times
        </div>
        <div>
          <label>staff_user_login_mins_limit</label>
          <input
            name="staff_user_login_mins_limit"
            type="number"
            defaultValue={settings && settings.staff_user_login_mins_limit}
            disabled={isEditSettings}
          />
          mins
        </div>
        <div>
          <label>staff_inactive_limit</label>
          <input
            name="staff_inactive_limit"
            type="number"
            defaultValue={settings && settings.staff_inactive_limit}
            disabled={isEditSettings}
          />
          days
        </div>
        <div>
          <label>customer_failed_login_limit</label>
          <input
            name="customer_failed_login_limit"
            type="number"
            defaultValue={settings && settings.customer_failed_login_limit}
            disabled={isEditSettings}
          />
          times
        </div>
        <div>
          <label>customer_user_login_mins_limit</label>
          <input
            name="customer_user_login_mins_limit"
            type="number"
            defaultValue={settings && settings.customer_user_login_mins_limit}
            disabled={isEditSettings}
          />
          mins
        </div>
        <div>
          <label>customer_inactive_limit</label>
          <input
            name="customer_inactive_limit"
            type="number"
            defaultValue={settings && settings.customer_inactive_limit}
            disabled={isEditSettings}
          />
          days
        </div>

        {!isEditSettings && (
          <div>
            <button type="submit" className="btn">
              Submit
            </button>
            <button
              className="btn"
              onClick={() => {
                setIsEditSettings(true);
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default AdminAdvanceSetting;
