import { useEffect, useState } from "react";
import { DeleteStaffUser, GetAllStaff, UpdateAdminUnlockStaff } from "../Api";
import Notification from "../Notification/Notification";
import lockedIcon from "../../assets/padlock-icon.svg";
import AdminAddStaff from "./AdminAddStaff";
import AdminEditStaff from "./AdminEditStaff";

const AdminStaff = ({ data }) => {
  const { labelValue, permission } = data;
  const actions = permission.find((p) => p.code === "staff").permission_actions;
  const [viewMode, setViewMode] = useState("list");
  const [user, setUser] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [notificationKey, setNotificationKey] = useState(0);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    status: "",
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = () => {
    GetAllStaff().then((data) => {
      const { status, msg } = data;
      if (status === "SUCCESS") {
        setUser(msg);
      } else {
        console.log(data);
      }
    });
  };

  const handleDeleteUser = (id, username) => {
    DeleteStaffUser({ id: id }).then(({ status, msg }) => {
      if (status === "SUCCESS") {
        setNotification({
          show: true,
          message: username + " " + msg,
          status: status,
        });
        fetchStaff();
      } else if (status === "WARNING") {
        setNotification({
          show: true,
          message: username + " " + msg,
          status: status,
        });
      } else if (status === "ERROR") {
        setNotification({
          show: true,
          message: msg,
          status: status,
        });
      }
      setNotificationKey((prev) => prev + 1);
    });
  };

  const handelEditUser = (id, username, name, role_id) => {
    setEditItem({ id, username, name, role_id });
    setViewMode("edit");
  };

  const handleUnLock = (id, username) => {
    UpdateAdminUnlockStaff({ id: id }).then(({ status, msg }) => {
      if (status === "SUCCESS") {
        setNotification({
          show: true,
          message: `${username} is successfully unlock`,
          status: status,
        });
        fetchStaff();
      } else if (status === "ERROR") {
        setNotification({
          show: true,
          message: msg,
          status: status,
        });
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
            {viewMode === "list" && <li className="text-xl">STAFF LIST</li>}
            {viewMode === "add" && <li className="text-xl">CREATE USER</li>}
            {viewMode === "edit" && <li className="text-xl">EDIT USER</li>}
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
            fetchStaff();
          }}
        >
          Staff List
        </button>

        {actions.includes("add") && (
          <button
            className={`btn btn-wide font-bold ${
              viewMode === "add" ? "btn-primary" : "btn-outline"
            }`}
            onClick={() => setViewMode("add")}
          >
            + Create User
          </button>
        )}
      </div>

      {viewMode === "add" && <AdminAddStaff />}
      {viewMode === "edit" && editItem && (
        <AdminEditStaff editItem={editItem} />
      )}

      {viewMode === "list" && (
        <table className="table table-lg">
          <thead>
            <tr>
              <td>is locked</td>
              <td>locked reason</td>
              <td>username</td>
              <td>name</td>
              {(actions.includes("edit") || actions.includes("delete")) && (
                <th className="text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {user &&
              user.map((u) => (
                <tr key={u.id}>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleUnLock(u.id, u.username)}
                    >
                      {u.is_locked === 1 && (
                        <img height="12" width="12" src={lockedIcon} />
                      )}
                    </button>
                  </td>
                  <td>{u.locked_reason != null ? u.locked_reason : "-"}</td>
                  <td>{u.username}</td>
                  <td>{u.name}</td>
                  {(actions.includes("edit") || actions.includes("delete")) && (
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        {actions.includes("edit") && (
                          <button
                            className="btn btn-warning"
                            onClick={() =>
                              handelEditUser(
                                u.id,
                                u.username,
                                u.name,
                                u.role_id,
                              )
                            }
                          >
                            Edit
                          </button>
                        )}

                        {actions.includes("delete") && (
                          <button
                            className="btn btn-error text-white"
                            onClick={() => handleDeleteUser(u.id, u.username)}
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
      )}
    </div>
  );
};

export default AdminStaff;
