import { useEffect, useState } from "react";
import {
  DeleteStaffUser,
  GetAllStaff,
  UpdateAdminUnlockStaff,
} from "../../Modules/Api";
import Notification from "../../Notification/Notification";
import lockedIcon from "../../../assets/padlock-icon.svg";
import StaffEditPage from "./StaffEditPage";
import StaffAddPage from "./AdminAddStaff";

const StaffPage = ({ data }) => {
  const { labelValue, permission, code } = data;
  const actions = permission.find((p) => p.code === code).permission_actions;
  const [viewMode, setViewMode] = useState("list");
  const [user, setUser] = useState([]);
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
      } else if (status == "NO DATA") {
        setUser([]);
      }
    });
  };

  const handleDelete = (id) => {
    DeleteStaffUser({ id }).then(({ status, msg }) => {
      setNotification({
        show: true,
        message: msg,
        status: status,
      });
      setNotificationKey((prev) => prev + 1);
      if (status === "SUCCESS") {
        fetchStaff();
      }
    });
  };

  const handleUnLock = (id) => {
    UpdateAdminUnlockStaff({ id: id }).then(({ status, msg }) => {
      setNotification({
        show: true,
        message: msg,
        status: status,
      });
      if (status === "SUCCESS") {
        fetchStaff();
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

      {viewMode === "add" && <StaffAddPage />}
      {viewMode === "edit" && editItem && <StaffEditPage editItem={editItem} />}

      {viewMode === "list" && (
        <div className="h-screen overflow-y-auto">
          <div className="overflow-x-auto">
            <table className="table table-lg">
              <thead>
                <tr>
                  <td>Is Locked</td>
                  <td>locked reason</td>
                  <td>Username</td>
                  <td>Name</td>
                  <td>Role</td>
                  {(actions.includes("edit") || actions.includes("delete")) && (
                    <th className="text-right">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {user.length > 0 ? (
                  user.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <button
                          type="button"
                          onClick={() => handleUnLock(u.id)}
                        >
                          {u.is_locked === 1 && (
                            <img
                              alt=""
                              height="12"
                              width="12"
                              src={lockedIcon}
                            />
                          )}
                        </button>
                      </td>
                      <td>{u.locked_reason != null ? u.locked_reason : "-"}</td>
                      <td>{u.username}</td>
                      <td>{u.name}</td>
                      <td>{u.role_name}</td>
                      {(actions.includes("edit") ||
                        actions.includes("delete")) && (
                        <td className="text-right">
                          <div className="flex justify-end gap-2">
                            {actions.includes("delete") &&
                              sessionStorage.getItem("staff_id") != u.id &&
                              u.is_system_id === 0 && (
                                <button
                                  className="btn btn-error text-white"
                                  onClick={() => handleDelete(u.id)}
                                >
                                  Delete
                                </button>
                              )}
                            {actions.includes("edit") && (
                              <button
                                className="btn btn-warning"
                                onClick={() => {
                                  setEditItem(u);
                                  setViewMode("edit");
                                }}
                              >
                                Edit
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={
                        actions.includes("edit") || actions.includes("delete")
                          ? 6
                          : 5
                      }
                      className="text-center"
                    >
                      No Staff Available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffPage;
