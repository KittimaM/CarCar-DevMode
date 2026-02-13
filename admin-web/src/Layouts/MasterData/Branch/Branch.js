import React, { useEffect, useState } from "react";
import Notification from "../../Notification/Notification";
import AddBranch from "./AddBranch";
import EditBranch from "./EditBranch";

const Branch = ({ data }) => {
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

  useEffect(() => {

  }, []);

  const handleDelete = (id) => {};

  const handleAvailable = (id, is_available) => {};

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
            {viewMode === "list" && <li className="text-xl">BRANCH LIST</li>}
            {viewMode === "add" && (
              <li className="text-xl">CREATE NEW BRANCH</li>
            )}
            {viewMode === "edit" && <li className="text-xl">EDIT BRANCH</li>}
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
          }}
        >
          Branch List
        </button>

        {actions.includes("add") && (
          <button
            className={`btn btn-wide font-bold ${
              viewMode === "add" ? "btn-primary" : "btn-outline"
            }`}
            onClick={() => setViewMode("add")}
          >
            + Create New Branch
          </button>
        )}
      </div>

      {viewMode === "add" && <AddBranch />}
      {viewMode === "edit" && editItem && (
        <EditBranch editItem={editItem} />
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
                  <th>Staff</th>
                  {(actions.includes("edit") || actions.includes("delete")) && (
                    <th className="text-right">Actions</th>
                  )}
                </tr>
              </thead>

              <tbody>
                {service.length > 0 ? (
                  service.map((s) => (
                    <tr key={s.service_id}>
                
                      <td>{s.name}</td>
                      <td>{s.size}</td>
                      <td>{s.duration_minute}</td>
                      <td>{s.price}</td>
                      <td>{s.required_staff}</td>
                      <td>
                        {s.staffs
                          .map((staff) => staff.staff_username)
                          .join(", ")}
                      </td>
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
                          ? 8
                          : 7
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

export default Branch;
