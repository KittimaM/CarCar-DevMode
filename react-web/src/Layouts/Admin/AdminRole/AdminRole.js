import React, { useEffect, useState } from "react";
import AdminAddRole from "./AdminAddRole";
import AdminEditRole from "./AdminEditRole";
import { DeleteRole, GetAllAdminRole } from "../../Api";
import URLList from "../../Url/URLList";
import Notification from "../../Notification/Notification";

const AdminRole = ({ permission }) => {
  const [roleList, setRoleList] = useState();
  const [isSelectedAddRole, setIsSelectedAddRole] = useState(false);
  const [isSelecteadRoleTable, setIsSelectedRoleTable] = useState(true);
  const [isSelectedEditItem, setIsSelectedEditItem] = useState(false);
  const [editItem, setEditItem] = useState();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState();
  const [notificationStatus, setNotificationStatus] = useState();

  const handleShowNotification = () => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
      setNotificationMessage(null);
    }, 3000);
  };

  const fetchAllRole = () => {
    GetAllAdminRole(URLList.AdminRole).then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        setRoleList(msg);
      } else {
        console.log(data);
      }
    });
  };

  useEffect(() => {
    fetchAllRole();
  }, []);

  const handleSelectEditId = (selectedItem) => {
    setIsSelectedEditItem(true);
    setIsSelectedAddRole(false);
    setIsSelectedRoleTable(false);
    setEditItem(selectedItem);
  };

  const handleSelectedContent = (event) => {
    event.preventDefault();
    const { value } = event.target;
    setIsSelectedAddRole(value == "add-role" ? true : false);
    setIsSelectedRoleTable(value == "role-table" ? true : false);
    setIsSelectedEditItem(false);
    if (value == "role-table") {
      fetchAllRole();
    }
  };

  const handleDeleteRole = (event) => {
    event.preventDefault();
    const jsonData = {
      id: event.target.value,
    };
    DeleteRole(URLList.AdminRole, jsonData).then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        setNotificationMessage("success deleted");
        setNotificationStatus(status);
        handleShowNotification();
        fetchAllRole();
      } else if (status == "ERROR") {
        if (msg.code == "ER_ROW_IS_REFERENCED_2") {
          setNotificationMessage("in use");
          setNotificationStatus(status);
          handleShowNotification();
        } else {
          console.log(data);
        }
      } else {
        console.log(data);
      }
    });
  };

  return (
    <div>
      {showNotification && (
        <Notification message={notificationMessage} type={notificationStatus} />
      )}
      <div className="ml-80 mt-16">
        <div className="text-lg bg-yellow-50 mb-5 ">Role</div>
        <button
          value="role-table"
          className="btn"
          disabled={isSelecteadRoleTable}
          onClick={handleSelectedContent}
        >
          All Role
        </button>
        {permission.includes("2") && (
          <button
            value="add-role"
            className="btn"
            disabled={isSelectedAddRole}
            onClick={handleSelectedContent}
          >
            Add Role
          </button>
        )}
        {isSelectedAddRole && <AdminAddRole />}
        {isSelectedEditItem && <AdminEditRole editItem={editItem} />}
        {isSelecteadRoleTable && (
          <table className="table table-lg">
            <thead>
              <tr>
                <td>role</td>
                {permission && permission.includes("3") && <td>Edit</td>}
                {permission && permission.includes("4") && <td>Delete</td>}
              </tr>
            </thead>
            <tbody>
              {roleList &&
                roleList.map((role) => (
                  <tr key={role.id}>
                    <td>{role.role}</td>
                    {permission && permission.includes("3") && (
                      <td>
                        <button
                          className="btn"
                          onClick={() => handleSelectEditId(role)}
                          value={role.id}
                        >
                          Edit
                        </button>
                      </td>
                    )}
                    {permission && permission.includes("4") && (
                      <td>
                        <button
                          className="btn"
                          onClick={handleDeleteRole}
                          value={role.id}
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminRole;
