import React, { useEffect, useState } from "react";
import AdminAddRole from "./AdminAddRole";
import AdminEditRole from "./AdminEditRole";
import { DeleteRole, GetAllAdminRole } from "../../Api";
import Notification from "../../Notification/Notification";

const AdminRole = ({ data }) => {
  const { labelValue, permission } = data;
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
    GetAllAdminRole().then((data) => {
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
    DeleteRole(jsonData).then((data) => {
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
      <div className="flex flex-col bg-[#ffffff] mx-auto p-5 rounded-lg shadow-xl h-full overflow-y-auto">
        {showNotification && (
          <Notification
            message={notificationMessage}
            type={notificationStatus}
          />
        )}
        <div>
          <div className="flex justify-start items-center text-4xl font-bold py-10 pl-10 border-b-2 border-[#e5e5e5]">
            {labelValue}
          </div>

          <button
            value="role-table"
            className="btn"
            disabled={isSelecteadRoleTable}
            onClick={handleSelectedContent}
          >
            All Role
          </button>
          {permission["add"] == 1 && (
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
                  {permission && permission["edit"] == 1 && <td>Edit</td>}
                  {permission && permission["delete"] == 1 && <td>Delete</td>}
                </tr>
              </thead>
              <tbody>
                {roleList &&
                  roleList.map((role) => (
                    <tr key={role.id}>
                      <td>{role.role}</td>
                      {permission && permission["edit"] == 1 && (
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
                      {permission && permission["delete"] == 1 && (
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
    </div>
  );
};

export default AdminRole;
