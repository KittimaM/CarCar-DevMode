import React, { useEffect, useState } from "react";
import { GetAdminGeneralSetting, UpdateAdminGeneralSetting } from "../Api";

const AdminGeneralSetting = ({ data }) => {
  const { labelValue, permission } = data;
  const [settings, setSettings] = useState();
  const [isEditSettings, setISEditSettings] = useState(true);

  useEffect(() => {
    GetAdminGeneralSetting().then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        setSettings(msg[0]);
      } else {
        console.log(data);
      }
    });
  }, []);

  const handleEdit = () => {
    setISEditSettings(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const jsonData = {
      staff_failed_login_limit: data.get("staff_failed_login_limit"),
    };
    UpdateAdminGeneralSetting(jsonData).then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        setISEditSettings(true);
      } else {
        console.log(data);
      }
    });
  };
  return (
    <div className="ml-80 mt-16">
      <div className="text-lg bg-yellow-100 mb-5 ">{labelValue}</div>
      <button className="btn" onClick={handleEdit}>
        edit
      </button>
      <form onSubmit={handleSubmit}>
        <label>staff failed login count Settings</label>
        <input
          name="staff_failed_login_limit"
          type="number"
          defaultValue={settings && settings.staff_failed_login_limit}
          disabled={isEditSettings}
        />
        {!isEditSettings && (
          <button type="submit" className="btn">
            Submit
          </button>
        )}
      </form>
    </div>
  );
};

export default AdminGeneralSetting;
