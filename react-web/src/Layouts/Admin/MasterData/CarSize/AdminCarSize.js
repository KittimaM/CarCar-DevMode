import React, { useEffect, useState } from "react";
import Notification from "../../../Notification/Notification";
import {
  DeleteCarSize,
  GetAllCarSize,
  UpdateCarSizeAvailable,
} from "../../../Api";
import AdminAddCarSize from "./AdminAddCarSize";
import AdminEditCarSize from "./AdminEditCarSize";
import checkIcon from "../../../../assets/green-checkmark-line-icon.svg";
import unCheckIcon from "../../../../assets/red-x-line-icon.svg";

const AdminCarSize = ({ data }) => {
  const { labelValue, permission } = data;
  const actions = permission.find(
    (p) => p.code === "carSize",
  ).permission_actions;
  const [viewMode, setViewMode] = useState("list");
  const [size, setSize] = useState("");
  const [editItem, setEditItem] = useState(null);
  const [notificationKey, setNotificationKey] = useState(0);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    status: "",
  });

  const fetchCarSize = () => {
    GetAllCarSize().then(({ status, msg }) => {
      if (status == "SUCCESS") {
        setSize(msg);
      }
    });
  };

  useEffect(() => {
    fetchCarSize();
  }, []);

  const handleAvailable = (id, size, is_available) => {
    UpdateCarSizeAvailable({ id: id, is_available: !is_available }).then(
      ({ status, msg }) => {
        if (status === "SUCCESS") {
          setNotification({
            show: true,
            message: size + " " + msg,
            status: status,
          });
          fetchCarSize();
        } else if (status === "ERROR") {
          setNotification({
            show: true,
            message: msg,
            status: status,
          });
        }
        setNotificationKey((prev) => prev + 1);
      },
    );
  };

  const handleEditCarSize = (id, size, description) => {
    setEditItem({ id, size, description });
    setViewMode("edit");
  };

  const handleDeleteCarSize = (id, size) => {
    DeleteCarSize({ id: id }).then(({ status, msg }) => {
      if (status === "SUCCESS") {
        setNotification({
          show: true,
          message: `${size} is successfully deleted`,
          status: status,
        });
        fetchCarSize();
      } else if (status == "WARNING") {
        setNotification({
          show: true,
          message: msg,
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
              <td>Status</td>
              <td>Size</td>
              <td>Description</td>
              {(actions.includes("edit") || actions.includes("delete")) && (
                <th className="text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {size &&
              size.map((c) => (
                <tr key={c.id}>
                  <td>
                    <button
                      type="button"
                      onClick={() =>
                        handleAvailable(c.id, c.size, c.is_available)
                      }
                    >
                      {c.is_available === 1 ? (
                        <img height="15" width="15" src={checkIcon} />
                      ) : (
                        <img height="15" width="15" src={unCheckIcon} />
                      )}
                    </button>
                  </td>
                  <td>{c.size}</td>
                  <td>{c.description}</td>
                  {(actions.includes("edit") || actions.includes("delete")) && (
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        {actions.includes("edit") && (
                          <button
                            className="btn btn-warning"
                            onClick={() =>
                              handleEditCarSize(c.id, c.size, c.description)
                            }
                          >
                            Edit
                          </button>
                        )}

                        {actions.includes("delete") && (
                          <button
                            className="btn btn-error text-white"
                            onClick={() => handleDeleteCarSize(c.id, c.size)}
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

export default AdminCarSize;
