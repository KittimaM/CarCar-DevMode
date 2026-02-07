import React, { useEffect, useState } from "react";
import AdminAddStatus from "./AdminAddStatus";
import AdminEditStatus from "./AdminEditStatus";
import Notification from "../../Notification/Notification";
import { DeleteStatus, GetAllStatus } from "../../Modules/Api";

const AdminStatus = ({ data }) => {
  const { labelValue, permission, code } = data;
  const actions = permission.find((p) => p.code === code).permission_actions;
  const [viewMode, setViewMode] = useState("list");
  const [status, setStatus] = useState();
  const [editItem, setEditItem] = useState(null);
  const [notificationKey, setNotificationKey] = useState(0);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    status: "",
  });

  const fetchStatus = () => {
    GetAllStatus().then(({ status, msg }) => {
      if (status === "SUCCESS") {
        setStatus(msg);
      } else if (status === "NO DATA") {
        setStatus(null);
      }
    });
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleDelete = ({ id, code }) => {
    DeleteStatus({ id }).then(({ status, msg }) => {
      if (status === "SUCCESS") {
        setNotification({
          show: true,
          message: `${code} is successfully deleted`,
          status: status,
        });
        fetchStatus();
      } else if (status === "ERROR" || status === "WARNING") {
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
            {viewMode === "list" && <li className="text-xl">STATUS LIST</li>}
            {viewMode === "add" && (
              <li className="text-xl">CREATE NEW STATUS</li>
            )}
            {viewMode === "edit" && <li className="text-xl">EDIT STATUS</li>}
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
            fetchStatus();
          }}
        >
          Status List
        </button>

        {actions.includes("add") && (
          <button
            className={`btn btn-wide font-bold ${
              viewMode === "add" ? "btn-primary" : "btn-outline"
            }`}
            onClick={() => setViewMode("add")}
          >
            + Create New Status
          </button>
        )}
      </div>

      {viewMode === "add" && <AdminAddStatus />}
      {viewMode === "edit" && editItem && (
        <AdminEditStatus editItem={editItem} />
      )}

      {viewMode === "list" && (
        <table className="table table-lg">
          <thead>
            <tr>
              <td>Status Code</td>
              {(actions.includes("edit") || actions.includes("delete")) && (
                <th className="text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {status &&
              status.map((s) => (
                <tr key={s.id}>
                  <td>{s.code}</td>
                  {(actions.includes("edit") || actions.includes("delete")) && (
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        {actions.includes("delete") && (
                          <button
                            className="btn btn-error text-white"
                            onClick={() => handleDelete(s)}
                          >
                            Delete
                          </button>
                        )}
                        {actions.includes("edit") && (
                          <button
                            className="btn btn-warning"
                            onClick={() => {
                              setViewMode("edit");
                              setEditItem(s);
                            }}
                          >
                            Edit
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

export default AdminStatus;
