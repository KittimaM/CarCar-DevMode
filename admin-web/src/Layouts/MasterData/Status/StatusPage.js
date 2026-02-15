import React, { useEffect, useState } from "react";
import Notification from "../../Notification/Notification";
import {
  DeleteStatus,
  GetAllStatus,
  DeleteStatusGroup,
} from "../../Modules/Api";
import StatusAddPage from "./StatusAddPage";
import StatusEditPage from "./StatusEditPage";
import StatusGroupAddPage from "./StatusGroup/StatusGroupAddPage";
import StatusGroupEditPage from "./StatusGroup/StatusGroupEditPage";

const StatusPage = ({ data }) => {
  const { labelValue, permission, code } = data;
  const actions = permission.find((p) => p.code === code)?.permission_actions;
  const [viewMode, setViewMode] = useState("list");
  const [statusGroups, setStatusGroups] = useState([]);
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
        const grouped = msg.reduce((acc, row) => {
          if (!acc[row.status_group_id]) {
            acc[row.status_group_id] = {
              status_group_id: row.status_group_id,
              status_group_code: row.status_group_code,
              statuses: [],
            };
          }

          acc[row.status_group_id].statuses.push({
            status_id: row.status_id,
            status_code: row.status_code,
          });

          return acc;
        }, {});

        setStatusGroups(Object.values(grouped));
      } else {
        setStatusGroups([]);
      }
    });
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleDeleteStatus = (id) => {
    DeleteStatus({ id }).then(({ status, msg }) => {
      setNotification({
        show: true,
        message: msg,
        status,
      });
      setNotificationKey((p) => p + 1);
      if (status === "SUCCESS") fetchStatus();
    });
  };

  const handleDeleteGroup = (id) => {
    DeleteStatusGroup({ id }).then(({ status, msg }) => {
      setNotification({
        show: true,
        message: msg,
        status,
      });
      setNotificationKey((p) => p + 1);
      if (status === "SUCCESS") fetchStatus();
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
            {viewMode === "add" && <li className="text-xl">CREATE STATUS</li>}
            {viewMode === "edit" && <li className="text-xl">EDIT STATUS</li>}
            {viewMode === "add_group" && (
              <li className="text-xl">CREATE STATUS GROUP</li>
            )}
            {viewMode === "edit_group" && (
              <li className="text-xl">EDIT STATUS GROUP</li>
            )}
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
            + Create Status
          </button>
        )}

        {actions.includes("add") && (
          <button
            className={`btn btn-wide font-bold ${
              viewMode === "add_group" ? "btn-primary" : "btn-outline"
            }`}
            onClick={() => setViewMode("add_group")}
          >
            + Create Status Group
          </button>
        )}
      </div>

      {viewMode === "add" && <StatusAddPage />}
      {viewMode === "edit" && editItem && (
        <StatusEditPage editItem={editItem} />
      )}
      {viewMode === "add_group" && <StatusGroupAddPage />}
      {viewMode === "edit_group" && editItem && (
        <StatusGroupEditPage editItem={editItem} />
      )}

      {viewMode === "list" && (
        <div className="h-screen overflow-y-auto">
          <div className="overflow-x-auto">
            {statusGroups && statusGroups.length > 0 ? (
              <div className="space-y-6">
                {statusGroups.map((group) => {
                  const hasStatus =
                    group.statuses.length > 0 &&
                    group.statuses.some((s) => s.status_id !== null);

                  return (
                    <div
                      key={group.status_group_id}
                      className="bg-gray-50 rounded-lg shadow-md p-4"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-700">
                          {group.status_group_code}
                        </h2>

                        {(actions?.includes("edit") ||
                          actions?.includes("delete")) && (
                          <div className="flex gap-2">
                            {actions.includes("delete") && (
                              <button
                                className="btn btn-error text-white"
                                onClick={() =>
                                  handleDeleteGroup(group.status_group_id)
                                }
                              >
                                Delete Group
                              </button>
                            )}
                            {actions.includes("edit") && (
                              <button
                                className="btn btn-warning"
                                onClick={() => {
                                  setEditItem({
                                    id: group.status_group_id,
                                    code: group.status_group_code,
                                  });
                                  setViewMode("edit_group");
                                }}
                              >
                                Edit Group
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      <table className="table table-lg table-pin-rows bg-white">
                        <thead>
                          <tr>
                            <th>Status Code</th>
                            {(actions?.includes("edit") ||
                              actions?.includes("delete")) && (
                              <th className="text-right">Actions</th>
                            )}
                          </tr>
                        </thead>

                        <tbody>
                          {!hasStatus ? (
                            <tr>
                              <td
                                colSpan={
                                  actions?.includes("edit") ||
                                  actions?.includes("delete")
                                    ? 2
                                    : 1
                                }
                                className="text-center text-gray-400"
                              >
                                No status
                              </td>
                            </tr>
                          ) : (
                            group.statuses.map((st) => (
                              <tr key={st.status_id}>
                                <td>{st.status_code}</td>

                                {(actions?.includes("edit") ||
                                  actions?.includes("delete")) && (
                                  <td className="text-right">
                                    <div className="flex justify-end gap-2">
                                      {actions.includes("delete") && (
                                        <button
                                          className="btn btn-error text-white"
                                          onClick={() =>
                                            handleDeleteStatus(st.status_id)
                                          }
                                        >
                                          Delete
                                        </button>
                                      )}

                                      {actions.includes("edit") && (
                                        <button
                                          className="btn btn-warning"
                                          onClick={() => {
                                            setEditItem({
                                              id: st.status_id,
                                              code: st.status_code,
                                              status_group_id:
                                                group.status_group_id,
                                            });
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
                          )}
                        </tbody>
                      </table>
                    </div>
                  );
                })}
              </div>
            ) : (
              <table className="table table-lg table-pin-rows">
                <thead>
                  <tr>
                    <th>Status Code</th>
                    {(actions?.includes("edit") ||
                      actions?.includes("delete")) && (
                      <th className="text-right">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      colSpan={
                        actions?.includes("edit") || actions?.includes("delete")
                          ? 2
                          : 1
                      }
                      className="text-center text-gray-400"
                    >
                      No Status Available
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusPage;
