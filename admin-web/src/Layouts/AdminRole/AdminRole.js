import { useEffect, useState } from "react";
import AdminAddRole from "./AdminAddRole";
import AdminEditRole from "./AdminEditRole";
import { DeleteRole, GetAllAdminRole } from "../Api";
import Notification from "../Notification/Notification";

const AdminRole = ({ data }) => {
  const { labelValue, permission } = data;
  const actions = permission.find((p) => p.code === "role").permission_actions;
  const [roleList, setRoleList] = useState([]);
  const [viewMode, setViewMode] = useState("list");
  const [editItem, setEditItem] = useState(null);
  const [notificationKey, setNotificationKey] = useState(0);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    status: "",
  });

  const fetchAllRole = () => {
    GetAllAdminRole().then(({ status, msg }) => {
      if (status === "SUCCESS") {
        setRoleList(msg);
      }
    });
  };

  useEffect(() => {
    fetchAllRole();
  }, []);

  const handleDeleteRole = (id, name) => {
    DeleteRole({ id }).then(({ status, msg }) => {
      if (status === "SUCCESS") {
        setNotification({
          show: true,
          message: `${name} is successfully deleted`,
          status: status,
        });
        fetchAllRole();
      } else if (status === "ERROR") {
        if (msg === "IN USE") {
          setNotification({
            show: true,
            message: `${name} is currently in use`,
            status: status,
          });
        }
      }
      setNotificationKey((prev) => prev + 1);
    });
  };

  const handleEditRole = (id) => {
    setEditItem(id);
    setViewMode("edit");
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
            {viewMode === "list" && <li className="text-xl">ROLE LIST</li>}
            {viewMode === "add" && <li className="text-xl">CREATE NEW ROLE</li>}
            {viewMode === "edit" && <li className="text-xl">EDIT ROLE</li>}
          </ul>
        </div>
      </div>

      <div className="flex gap-4 my-6">
        <button
          className={`btn btn-wide font-bold ${
            viewMode === "list" ? "btn-primary" : "btn-outline"
          }`}
          onClick={() => {
            setViewMode("list");
            fetchAllRole();
          }}
        >
          Role List
        </button>

        {actions.includes("add") && (
          <button
            className={`btn btn-wide font-bold ${
              viewMode === "add" ? "btn-primary" : "btn-outline"
            }`}
            onClick={() => setViewMode("add")}
          >
            + Create New Role
          </button>
        )}
      </div>

      {viewMode === "add" && <AdminAddRole />}
      {viewMode === "edit" && editItem && <AdminEditRole editItem={editItem} />}

      {viewMode === "list" && (
        <div className="h-screen overflow-y-auto">
          <table className="table table-lg table-pin-rows">
            <thead>
              <tr>
                <th>Role</th>
                {(actions.includes("edit") || actions.includes("delete")) && (
                  <th className="text-right">Actions</th>
                )}
              </tr>
            </thead>

            <tbody>
              {roleList.map((role) => (
                <tr key={role.id}>
                  <td>{role.name}</td>

                  {(actions.includes("edit") || actions.includes("delete")) && (
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        {actions.includes("edit") && (
                          <button
                            className="btn btn-warning"
                            onClick={() => handleEditRole(role)}
                          >
                            Edit
                          </button>
                        )}

                        {actions.includes("delete") && (
                          <button
                            className="btn btn-error text-white"
                            onClick={() => handleDeleteRole(role.id, role.name)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminRole;
