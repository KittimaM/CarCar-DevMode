import React, { useEffect, useState } from "react";
import { GetAllAdminRoleLabel, PostAdminAddRole } from "../../Api";
import URLList from "../../Url/URLList";
import Notification from "../../Notification/Notification";

const AdminAddRole = () => {
  const [roleLabelList, setRoleLabelList] = useState(null);
  const [roleName, setRoleName] = useState("");
  const [errors, setErrors] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState();
  const [notificationStatus, setNotificationStatus] = useState();

  const fetchRoleLabel = () => {
    GetAllAdminRoleLabel(URLList.AdminRoleLabel).then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        msg.map((item) => {
          item["access"] = [0];
        });
        setRoleLabelList(msg);
      } else {
        console.log(data);
      }
    });
    setRoleName("");
    setErrors([]);
  };
  useEffect(() => {
    fetchRoleLabel();
  }, []);

  const handleShowNotification = () => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
      setNotificationMessage(null);
    }, 3000);
  };

  const handleRoleName = (event) => {
    setRoleName(event.target.value);
  };

  const validateData = (data) => {
    let errorMsg = {};
    if (data.get("role") == null || data.get("role") == "") {
      errorMsg["role"] = "please insert data";
    }
    if (Object.entries(errorMsg).length !== 0) {
      return { status: "ERROR", msg: errorMsg };
    } else {
      return {
        status: "SUCCESS",
        msg: "",
      };
    }
  };

  const handleEnableAccess = (event) => {
    const { name, value, checked } = event.target;
    const accessValue = parseInt(value);
    setRoleLabelList(
      roleLabelList.map((roleLabel) => {
        if (roleLabel.role == name) {
          if (checked) {
            if (value == "1") {
              roleLabel["access"] = [accessValue];
            } else {
              roleLabel["access"] = [...roleLabel["access"], accessValue];
            }
          } else {
            if (value == "1") {
              roleLabel["access"] = [0];
            } else {
              roleLabel["access"] = roleLabel["access"].filter(
                (item) => item !== accessValue
              );
            }
          }
        }
        return roleLabel;
      })
    );
  };

  const subRoleContent = (headerRole) => {
    let subRole = [];
    const roleLabelListDefault = roleLabelList;
    roleLabelListDefault.map((roleLabel) => {
      if (headerRole.is_have_sub_role == 1) {
        if (roleLabel.header_module_id == headerRole.id) {
          subRole.push(roleLabel);
        }
      }
    });

    if (subRole.length == 0) {
      if (
        headerRole.role == "have_booking_access" ||
        headerRole.role == "have_payment_access"
      ) {
        return;
      } else {
        return (
          <div>
            <div className={subAccessContent(headerRole, 2)}>
              <input
                checked={headerRole.access.includes(2)}
                className="toggle"
                type="checkbox"
                name={headerRole.role}
                value="2"
                onChange={handleEnableAccess}
              />
              <label>add</label>
            </div>
            <div className={subAccessContent(headerRole, 3)}>
              <input
                checked={headerRole.access.includes(3)}
                className="toggle"
                type="checkbox"
                name={headerRole.role}
                value="3"
                onChange={handleEnableAccess}
              />
              <label>edit</label>
            </div>
            <div className={subAccessContent(headerRole, 4)}>
              <input
                checked={headerRole.access.includes(4)}
                className="toggle"
                type="checkbox"
                name={headerRole.role}
                value="4"
                onChange={handleEnableAccess}
              />
              <label>delete</label>
            </div>
            <div className={subAccessContent(headerRole, 5)}>
              <input
                checked={headerRole.access.includes(5)}
                className="toggle"
                type="checkbox"
                name={headerRole.role}
                value="5"
                onChange={handleEnableAccess}
              />
              <label>approve</label>
            </div>
          </div>
        );
      }
    } else {
      return (
        <div>
          {subRole.map(
            (role) =>
              role.module_level == 2 && (
                <div>
                  <input
                    checked={role.access.includes(1)}
                    className="toggle"
                    type="checkbox"
                    name={role.role}
                    value="1"
                    onChange={handleEnableAccess}
                  />
                  <label>{role.label}</label>
                  {role.access.includes(1) && subRoleContent(role)}
                </div>
              )
          )}
        </div>
      );
    }
  };

  const subAccessContent = (roleList, actionValue) => {
    //action value
    // 1 view
    // 2 add
    // 3 edit
    // 4 delete
    // 5 approve
    const { role } = roleList;
    if (role == "have_on_leave_personal_access") {
      if (actionValue == 3 || actionValue == 4 || actionValue == 5) {
        return "hidden";
      }
    } else if (role !== "have_on_leave_list_access") {
      if (actionValue == 5) {
        return "hidden";
      }
    }
  };

  const handleAddRole = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const validatedErrors = validateData(data);
    const { status, msg } = validatedErrors;
    if (status == "ERROR") {
      setErrors(msg);
    } else {
      const accessData = [];
      roleLabelList.map((roleLabel) => {
        accessData[roleLabel.role] = roleLabel["access"].join(",");
      });
      const jsonData = {
        role: data.get("role"),
        ...accessData,
      };
      PostAdminAddRole(URLList.AdminRole, jsonData).then((data) => {
        const { status, msg } = data;
        if (status == "SUCCESS") {
          setNotificationMessage(`success add = ${jsonData.role}`);
          setNotificationStatus(status);
          handleShowNotification();
          setRoleLabelList(null);
          fetchRoleLabel();
        } else if (status == "ERROR") {
          let errorMsg = {};
          if (msg.code == "ER_DUP_ENTRY") {
            errorMsg["role"] = "Duplicated Role Name";
            setErrors(errorMsg);
          } else {
            console.log(data);
          }
        } else {
          console.log(data);
        }
      });
    }
  };

  return (
    <div>
      {showNotification && (
        <Notification message={notificationMessage} type={notificationStatus} />
      )}
      <form onSubmit={handleAddRole}>
        <div>
          <label>Role Name</label>
          <input
            type="text"
            name="role"
            value={roleName}
            onChange={handleRoleName}
          />
          {errors.role && errors.role}
        </div>
        <div>
          {roleLabelList &&
            roleLabelList.map(
              (roleLabel) =>
                roleLabel.module_level == 1 && (
                  <div>
                    <input
                      checked={roleLabel.access.includes(1)}
                      className="toggle"
                      type="checkbox"
                      name={roleLabel.role}
                      value="1"
                      onChange={handleEnableAccess}
                    />
                    <label>{roleLabel.label}</label>
                    {roleLabel.access.includes(1) && subRoleContent(roleLabel)}
                  </div>
                )
            )}
        </div>
        <button type="submit" className="btn">
          Submit
        </button>
      </form>
      <button className="btn" onClick={fetchRoleLabel}>
        Cancel
      </button>
    </div>
  );
};

export default AdminAddRole;
