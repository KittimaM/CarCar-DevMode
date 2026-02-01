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
        setService(null);
      } else {
        console.log(data);
      }
    });
  };

  useEffect(() => {
    fetchService();
  }, []);

  const handleEditService = (s) => {
    setEditItem(s);
    setViewMode("edit");
  };

  const handleDeleteService = (id, service) => {
    DeleteService({ id: id }).then(({ status, msg }) => {
      if (status === "SUCCESS") {
        setNotification({
          show: true,
          message: service + " " + msg,
          status: status,
        });
        fetchService();
      } else if (status === "WARNING") {
        setNotification({
          show: true,
          message: service + " " + msg,
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

  const handleAvailable = (id, service, is_available) => {
    UpdateServiceAvailable({ id: id, is_available: !is_available }).then(
      ({ status, msg }) => {
        if (status === "SUCCESS") {
          setNotification({
            show: true,
            message: service + " " + msg,
            status: status,
          });
          fetchService();
        } else if (status === "ERROR") {
          setNotification({
            show: true,
            message: msg,
            status: status,
          });
        }
        setNotificationKey((prev) => prev + 1);
      }
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
                  <th>Car Size</th>
                  <th>Duration (Mins)</th>
                  <th>Price</th>
                  <th>Required Staff</th>
                  {(actions.includes("edit") || actions.includes("delete")) && (
                    <th className="text-right">Actions</th>
                  )}
                </tr>
              </thead>

              <tbody>
                {service &&
                  service.map((s) => (
                    <tr key={s.id}>
                      <td>
                        <button
                          type="button"
                          onClick={() =>
                            handleAvailable(s.id, s.name, s.is_available)
                          }
                        >
                          {s.is_available === 1 ? (
                            <img height="15" width="15" src={checkIcon} />
                          ) : (
                            <img height="15" width="15" src={unCheckIcon} />
                          )}
                        </button>
                      </td>
                      <td>{s.name}</td>
                      <td>{s.car_size}</td>
                      <td>{s.duration_minute}</td>
                      <td>{s.price}</td>
                      <td>{s.required_staff}</td>
                      {(actions.includes("edit") ||
                        actions.includes("delete")) && (
                        <td className="text-right">
                          <div className="flex justify-end gap-2">
                            {actions.includes("delete") && (
                              <button
                                className="btn btn-error text-white"
                                onClick={() =>
                                  handleDeleteService(s.id, s.name)
                                }
                              >
                                Delete
                              </button>
                            )}
                            {actions.includes("edit") && (
                              <button
                                className="btn btn-warning"
                                onClick={() => handleEditService(s)}
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
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminService;
