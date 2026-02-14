import React, { useEffect, useState } from "react";
import Notification from "../../Notification/Notification";
import AdminAddService from "./AdminAddService";
import AdminEditService from "./AdminEditService";
import {
  DeleteService,
  GetAllService,
  UpdateServiceAvailable,
} from "../../Modules/Api";
import checkIcon from "../../../assets/green-checkmark-line-icon.svg";
import unCheckIcon from "../../../assets/red-x-line-icon.svg";

const AdminService = ({ data }) => {
  const { labelValue, permission, code } = data;
  const actions = permission.find((p) => p.code === code).permission_actions;
  const [service, setService] = useState([]);
  const [viewMode, setViewMode] = useState("list");
  const [editItem, setEditItem] = useState(null);
  const [notificationKey, setNotificationKey] = useState(0);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    status: "",
  });

  const fetchService = () => {
    GetAllService().then((data) => {
      const { status, msg } = data;
      if (status === "SUCCESS") {
        setService(msg);
      } else if (status === "NO DATA") {
        setService([]);
      }
    });
  };

  useEffect(() => {
    fetchService();
  }, []);

  const handleDelete = (id) => {
    DeleteService({ id }).then(({ status, msg }) => {
      setNotification({
        show: true,
        message: msg,
        status: status,
      });
      setNotificationKey((prev) => prev + 1);
      if (status === "SUCCESS") {
        fetchService();
      }
    });
  };

  const handleAvailable = (id, is_available) => {
    UpdateServiceAvailable({ id: id, is_available: !is_available }).then(
      ({ status, msg }) => {
        setNotification({
          show: true,
          message: msg,
          status: status,
        });
        setNotificationKey((prev) => prev + 1);
        if (status === "SUCCESS") {
          fetchService();
        }
      },
    );
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
            {viewMode === "list" && <li className="text-xl">SERVICE LIST</li>}
            {viewMode === "add" && (
              <li className="text-xl">CREATE NEW SERVICE</li>
            )}
            {viewMode === "edit" && <li className="text-xl">EDIT SERVICE</li>}
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
            fetchService();
          }}
        >
          Service List
        </button>

        {actions.includes("add") && (
          <button
            className={`btn btn-wide font-bold ${
              viewMode === "add" ? "btn-primary" : "btn-outline"
            }`}
            onClick={() => setViewMode("add")}
          >
            + Create New Service
          </button>
        )}
      </div>

      {viewMode === "add" && <AdminAddService />}
      {viewMode === "edit" && editItem && (
        <AdminEditService editItem={editItem} />
      )}

      {viewMode === "list" && (
        <div className="h-screen overflow-y-auto">
          <div className="overflow-x-auto">
            <table className="table table-lg table-pin-rows">
              <thead>
                <tr>
                  <th>Available Status</th>
                  <th>Name</th>
                  {(actions.includes("edit") || actions.includes("delete")) && (
                    <th className="text-right">Actions</th>
                  )}
                </tr>
              </thead>

              <tbody>
                {service.length > 0 ? (
                  service.map((s) => (
                    <tr key={s.id}>
                      <td>
                        <button
                          type="button"
                          disabled={!actions.includes("edit")}
                          onClick={() => handleAvailable(s.id, s.is_available)}
                        >
                          {s.is_available === 1 ? (
                            <img
                              alt=""
                              height="15"
                              width="15"
                              src={checkIcon}
                            />
                          ) : (
                            <img
                              alt=""
                              height="15"
                              width="15"
                              src={unCheckIcon}
                            />
                          )}
                        </button>
                      </td>
                      <td>{s.name}</td>
                      {(actions.includes("edit") ||
                        actions.includes("delete")) && (
                        <td className="text-right">
                          <div className="flex justify-end gap-2">
                            {actions.includes("delete") && (
                              <button
                                className="btn btn-error text-white"
                                onClick={() => handleDelete(s.id)}
                              >
                                Delete
                              </button>
                            )}
                            {actions.includes("edit") && (
                              <button
                                className="btn btn-warning"
                                onClick={() => {
                                  setEditItem(s);
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
                          ? 3
                          : 2
                      }
                      className="text-center"
                    >
                      No Service Available
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

export default AdminService;
