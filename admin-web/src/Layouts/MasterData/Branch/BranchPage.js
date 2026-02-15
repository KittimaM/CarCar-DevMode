import React, { useEffect, useState } from "react";
import Notification from "../../Notification/Notification";
import {
  GetAllBranch,
  DeleteBranch,
} from "../../Modules/Api";
import BranchAddPage from "./BranchAddPage";
import BranchEditPage from "./BranchEditPage";

const BranchPage = ({ data }) => {
  const { labelValue, permission, code } = data;
  const actions = permission.find((p) => p.code === code).permission_actions;
  const [branch, setBranch] = useState([]);
  const [viewMode, setViewMode] = useState("list");
  const [editItem, setEditItem] = useState(null);
  const [notificationKey, setNotificationKey] = useState(0);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    status: "",
  });

  const fetchBranch = () => {
    GetAllBranch().then(({ status, msg }) => {
      if (status === "SUCCESS") {
        setBranch(msg);
      } else if (status === "NO DATA") {
        setBranch([]);
      }
    });
  };

  useEffect(() => {
    fetchBranch();
  }, []);

  const handleDelete = (id) => {
    DeleteBranch({ id }).then(({ status, msg }) => {
      setNotification({
        show: true,
        status: status,
        message: msg,
      });
      setNotificationKey((prev) => prev + 1);
      if (status === "SUCCESS") {
        fetchBranch();
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
            fetchBranch();
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

      {viewMode === "add" && <BranchAddPage />}
      {viewMode === "edit" && editItem && <BranchEditPage editItem={editItem} />}

      {viewMode === "list" && (
        <div className="h-screen overflow-y-auto">
          <div className="overflow-x-auto">
            <table className="table table-lg table-pin-rows">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Phone</th>
                  {(actions.includes("edit") || actions.includes("delete")) && (
                    <th className="text-right">Actions</th>
                  )}
                </tr>
              </thead>

              <tbody>
                {branch.length > 0 ? (
                  branch.map((b) => (
                    <tr key={b.branch_id}>
                      <td>{b.name}</td>
                      <td>{b.address}</td>
                      <td>{b.phone}</td>
                      {(actions.includes("edit") ||
                        actions.includes("delete")) && (
                        <td className="text-right">
                          <div className="flex justify-end gap-2">
                            {actions.includes("delete") && (
                              <button
                                className="btn btn-error text-white"
                                onClick={() => handleDelete(b.id)}
                              >
                                Delete
                              </button>
                            )}
                            {actions.includes("edit") && (
                              <button
                                className="btn btn-warning"
                                onClick={() => {
                                  setEditItem(b);
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
                          ? 5
                          : 4
                      }
                      className="text-center text-gray-400"
                    >
                      No Branch Available
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

export default BranchPage;  
