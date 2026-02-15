import React, { useEffect, useState } from "react";
import Notification from "../../Notification/Notification";
import { DeleteCarSize, GetAllCarSize } from "../../Modules/Api";
import AdminAddCarSize from "./AdminAddCarSize";
import AdminEditCarSize from "./AdminEditCarSize";

const AdminCarSize = ({ data }) => {
  const { labelValue, permission, code } = data;
  const actions = permission.find((p) => p.code === code).permission_actions;
  const [viewMode, setViewMode] = useState("list");
  const [size, setSize] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [notificationKey, setNotificationKey] = useState(0);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    status: "",
  });

  const fetchCarSize = () => {
    GetAllCarSize().then(({ status, msg }) => {
      if (status === "SUCCESS") {
        setSize(msg);
      } else if (status == "NO DATA") {
        setSize([]);
      }
    });
  };

  useEffect(() => {
    fetchCarSize();
  }, []);

  const handleDelete = (id) => {
    DeleteCarSize({ id }).then(({ status, msg }) => {
      setNotification({
        show: true,
        message: msg,
        status: status,
      });
      setNotificationKey((prev) => prev + 1);
      if (status === "SUCCESS") {
        fetchCarSize();
      }
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
            {viewMode === "list" && <li className="text-xl">CAR SIZE LIST</li>}
            {viewMode === "add" && (
              <li className="text-xl">CREATE NEW CAR SIZE</li>
            )}
            {viewMode === "edit" && <li className="text-xl">EDIT CAR SIZE</li>}
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
            fetchCarSize();
          }}
        >
          Car Size List
        </button>

        {actions.includes("add") && (
          <button
            className={`btn btn-wide font-bold ${
              viewMode === "add" ? "btn-primary" : "btn-outline"
            }`}
            onClick={() => setViewMode("add")}
          >
            + Create New Car Size
          </button>
        )}
      </div>

      {viewMode === "add" && <AdminAddCarSize />}
      {viewMode === "edit" && editItem && (
        <AdminEditCarSize editItem={editItem} />
      )}

      {viewMode === "list" && (
        <table className="table table-lg">
          <thead>
            <tr>
              <td>Size</td>
              {(actions.includes("edit") || actions.includes("delete")) && (
                <th className="text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {size.length > 0 ? (
              size.map((c) => (
                <tr key={c.id}>
                  <td>{c.size}</td>
                  {(actions.includes("edit") || actions.includes("delete")) && (
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        {actions.includes("delete") && (
                          <button
                            className="btn btn-error text-white"
                            onClick={() => handleDelete(c.id)}
                          >
                            Delete
                          </button>
                        )}
                        {actions.includes("edit") && (
                          <button
                            className="btn btn-warning"
                            onClick={() => {
                              setEditItem(c);
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
                      ? 2
                      : 1
                  }
                  className="text-center text-gray-400"
                >
                  No Car Size Available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminCarSize;
