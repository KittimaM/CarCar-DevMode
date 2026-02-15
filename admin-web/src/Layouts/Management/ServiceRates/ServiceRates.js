import React, { useEffect, useState } from "react";
import Notification from "../../Notification/Notification";
import AddServiceRates from "./AddServiceRates";
import EditServiceRates from "./EditServiceRates";
import { PostDeleteServiceRates, GetAllServiceRates } from "../../Modules/Api";

const ServiceRates = ({ data }) => {
  const { labelValue, permission, code } = data;
  const actions = permission.find((p) => p.code === code).permission_actions;
  const [serviceRates, setServiceRates] = useState([]);
  const [viewMode, setViewMode] = useState("list");
  const [editItem, setEditItem] = useState(null);
  const [notificationKey, setNotificationKey] = useState(0);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    status: "",
  });

  const fetchServiceRates = () => {
    GetAllServiceRates().then((data) => {
      const { status, msg } = data;
      if (status === "SUCCESS") {
        setServiceRates(msg);
      } else if (status === "NO DATA") {
        setServiceRates([]);
      }
    });
  };

  useEffect(() => {
    fetchServiceRates();
  }, []);

  const handleDelete = (id) => {
    PostDeleteServiceRates({ id }).then(({ status, msg }) => {
      setNotification({
        show: true,
        message: msg,
        status: status,
      });
      setNotificationKey((prev) => prev + 1);
      if (status === "SUCCESS") {
        fetchServiceRates();
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
            fetchServiceRates();
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

      {viewMode === "add" && <AddServiceRates />}
      {viewMode === "edit" && editItem && (
        <EditServiceRates editItem={editItem} />
      )}

      {viewMode === "list" && (
        <div className="h-screen overflow-y-auto">
          <div className="overflow-x-auto">
            <table className="table table-lg table-pin-rows">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Car Size</th>
                  <th>Duration</th>
                  <th>Price</th>
                  <th>Required Staff</th>
                  {(actions.includes("edit") || actions.includes("delete")) && (
                    <th className="text-right">Actions</th>
                  )}
                </tr>
              </thead>

              <tbody>
                {serviceRates.length > 0 ? (
                  serviceRates.map((s) => (
                    <tr key={s.id}>
                      <td>{s.service_name}</td>
                      <td>{s.size}</td>
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
                          ? 7
                          : 6
                      }
                      className="text-center text-gray-400"
                    >
                      No Service Rates Available
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

export default ServiceRates;
