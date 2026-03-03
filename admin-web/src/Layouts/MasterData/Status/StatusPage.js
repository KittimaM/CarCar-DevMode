import React, { useEffect, useState, useMemo } from "react";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteGroupConfirm, setDeleteGroupConfirm] = useState(null);
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
      setDeleteConfirm(null);
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
      setDeleteGroupConfirm(null);
      if (status === "SUCCESS") fetchStatus();
    });
  };

  const filteredStatusGroups = useMemo(() => {
    if (!searchTerm) return statusGroups;
    
    return statusGroups.filter(
      (group) =>
        group.status_group_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.statuses.some((s) =>
          s.status_code?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  }, [statusGroups, searchTerm]);

  const totalStatuses = useMemo(() => {
    return statusGroups.reduce((acc, group) => {
      const validStatuses = group.statuses.filter((s) => s.status_id !== null);
      return acc + validStatuses.length;
    }, 0);
  }, [statusGroups]);

  return (
    <div className="flex flex-col h-full bg-base-100">
      {notification.show && (
        <Notification
          key={notificationKey}
          message={notification.message}
          status={notification.status}
        />
      )}

      {/* Header */}
      <div className="px-4 sm:px-8 py-6 sm:py-8 shadow-md bg-gradient-to-r from-accent/10 via-accent/5 to-transparent border-b border-base-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs sm:text-sm font-semibold text-accent uppercase tracking-wider mb-1 sm:mb-2">{labelValue}</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-base-content">
              {viewMode === "list" && "Status List"}
              {viewMode === "add" && "Create Status"}
              {viewMode === "edit" && "Edit Status"}
              {viewMode === "add_group" && "Create Status Group"}
              {viewMode === "edit_group" && "Edit Status Group"}
            </h1>
          </div>

          <div className="flex flex-wrap gap-2">
            {viewMode !== "list" && (
              <button
                className="btn btn-ghost btn-sm sm:btn-md gap-2"
                onClick={() => {
                  setViewMode("list");
                  setEditItem(null);
                  fetchStatus();
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                <span className="hidden sm:inline">Back to List</span>
                <span className="sm:hidden">Back</span>
              </button>
            )}
            {actions?.includes("add") && viewMode === "list" && (
              <>
                <button
                  className="btn btn-accent btn-sm sm:btn-md gap-2 shadow-md"
                  onClick={() => setViewMode("add")}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  <span className="hidden sm:inline">Add Status</span>
                  <span className="sm:hidden">Status</span>
                </button>
                <button
                  className="btn btn-accent btn-outline btn-sm sm:btn-md gap-2 shadow-md"
                  onClick={() => setViewMode("add_group")}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  <span className="hidden sm:inline">Add Group</span>
                  <span className="sm:hidden">Group</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8">
        {viewMode === "add" && (
          <StatusAddPage
            onBack={() => {
              setViewMode("list");
              fetchStatus();
            }}
            onSuccess={(msg) => {
              setNotification({
                show: true,
                message: msg,
                status: "SUCCESS",
              });
              setNotificationKey((p) => p + 1);
              setViewMode("list");
              fetchStatus();
            }}
          />
        )}

        {viewMode === "edit" && editItem && (
          <StatusEditPage
            editItem={editItem}
            onBack={() => {
              setEditItem(null);
              setViewMode("list");
              fetchStatus();
            }}
            onSuccess={(msg) => {
              setNotification({
                show: true,
                message: msg,
                status: "SUCCESS",
              });
              setNotificationKey((p) => p + 1);
              setEditItem(null);
              setViewMode("list");
              fetchStatus();
            }}
          />
        )}

        {viewMode === "add_group" && (
          <StatusGroupAddPage
            onBack={() => {
              setViewMode("list");
              fetchStatus();
            }}
            onSuccess={(msg) => {
              setNotification({
                show: true,
                message: msg,
                status: "SUCCESS",
              });
              setNotificationKey((p) => p + 1);
              setViewMode("list");
              fetchStatus();
            }}
          />
        )}

        {viewMode === "edit_group" && editItem && (
          <StatusGroupEditPage
            editItem={editItem}
            onBack={() => {
              setEditItem(null);
              setViewMode("list");
              fetchStatus();
            }}
            onSuccess={(msg) => {
              setNotification({
                show: true,
                message: msg,
                status: "SUCCESS",
              });
              setNotificationKey((p) => p + 1);
              setEditItem(null);
              setViewMode("list");
              fetchStatus();
            }}
          />
        )}

        {viewMode === "list" && (
          <div className="max-w-6xl">
            {/* Search & Stats */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by group or status code..."
                  className="input input-bordered w-full pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <p className="text-sm text-base-content/60">
                {statusGroups.length} {statusGroups.length === 1 ? "group" : "groups"}, {totalStatuses} {totalStatuses === 1 ? "status" : "statuses"}
              </p>
            </div>

            {/* Status Groups */}
            {filteredStatusGroups.length > 0 ? (
              <div className="space-y-6">
                {filteredStatusGroups.map((group) => {
                  const hasStatus =
                    group.statuses.length > 0 &&
                    group.statuses.some((s) => s.status_id !== null);

                  return (
                    <div
                      key={group.status_group_id}
                      className="bg-base-100 border border-base-300 rounded-xl overflow-hidden"
                    >
                      {/* Group Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-4 bg-base-200/50 border-b border-base-300">
                        <h2 className="text-lg sm:text-xl font-bold text-base-content">
                          {group.status_group_code}
                        </h2>

                        {(actions?.includes("edit") || actions?.includes("delete")) && (
                          <div className="flex gap-1">
                            {actions.includes("edit") && (
                              <button
                                className="btn btn-ghost btn-sm gap-1"
                                onClick={() => {
                                  setEditItem({
                                    id: group.status_group_id,
                                    code: group.status_group_code,
                                  });
                                  setViewMode("edit_group");
                                }}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                                <span className="hidden sm:inline">Edit Group</span>
                              </button>
                            )}
                            {actions.includes("delete") && (
                              <button
                                className="btn btn-ghost btn-sm text-error hover:bg-error/10 gap-1"
                                onClick={() => setDeleteGroupConfirm(group)}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <span className="hidden sm:inline">Delete Group</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Status Table */}
                      <div className="overflow-x-auto">
                        <table className="table">
                          <thead>
                            <tr className="bg-base-100">
                              <th className="font-semibold w-12 text-center">#</th>
                              <th className="font-semibold">Status Code</th>
                              {(actions?.includes("edit") || actions?.includes("delete")) && (
                                <th className="font-semibold text-right">Actions</th>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {!hasStatus ? (
                              <tr>
                                <td
                                  colSpan={actions?.includes("edit") || actions?.includes("delete") ? 3 : 2}
                                  className="text-center py-8 text-base-content/50"
                                >
                                  No status in this group
                                </td>
                              </tr>
                            ) : (
                              group.statuses
                                .filter((s) => s.status_id !== null)
                                .map((st, index) => (
                                  <tr key={st.status_id} className="hover:bg-base-50">
                                    <td className="text-center text-base-content/60 font-medium">{index + 1}</td>
                                    <td className="font-medium">{st.status_code}</td>
                                    {(actions?.includes("edit") || actions?.includes("delete")) && (
                                      <td className="text-right">
                                        <div className="flex justify-end gap-1">
                                          {actions.includes("edit") && (
                                            <button
                                              className="btn btn-ghost btn-square btn-sm"
                                              onClick={() => {
                                                setEditItem({
                                                  id: st.status_id,
                                                  code: st.status_code,
                                                  status_group_id: group.status_group_id,
                                                });
                                                setViewMode("edit");
                                              }}
                                              title="Edit"
                                            >
                                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                              </svg>
                                            </button>
                                          )}
                                          {actions.includes("delete") && (
                                            <button
                                              className="btn btn-ghost btn-square btn-sm text-error hover:bg-error/10"
                                              onClick={() => setDeleteConfirm({ ...st, group_code: group.status_group_code })}
                                              title="Delete"
                                            >
                                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                              </svg>
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
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden">
                <div className="text-center py-12 text-base-content/50">
                  {searchTerm ? "No status groups match your search" : "No status groups available"}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Status Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
            <div className="relative bg-base-100 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
              <div className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-error/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-error" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-base-content mb-2">ยืนยันการลบ</h3>
                <p className="text-base-content/70">
                  คุณต้องการลบสถานะ <span className="font-semibold text-error">"{deleteConfirm.status_code}"</span> หรือไม่?
                </p>
                <p className="text-sm text-base-content/50 mt-1">การดำเนินการนี้ไม่สามารถย้อนกลับได้</p>
              </div>
              <div className="flex border-t border-base-200">
                <button
                  className="flex-1 py-4 text-base font-medium text-base-content/70 hover:bg-base-200 transition-colors"
                  onClick={() => setDeleteConfirm(null)}
                >
                  ยกเลิก
                </button>
                <div className="w-px bg-base-200" />
                <button
                  className="flex-1 py-4 text-base font-medium text-error hover:bg-error/10 transition-colors"
                  onClick={() => handleDeleteStatus(deleteConfirm.status_id)}
                >
                  ลบ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Group Confirmation Modal */}
      {deleteGroupConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteGroupConfirm(null)} />
            <div className="relative bg-base-100 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
              <div className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-error/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-error" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-base-content mb-2">ยืนยันการลบกลุ่ม</h3>
                <p className="text-base-content/70">
                  คุณต้องการลบกลุ่ม <span className="font-semibold text-error">"{deleteGroupConfirm.status_group_code}"</span> หรือไม่?
                </p>
                <p className="text-sm text-base-content/50 mt-1">สถานะทั้งหมดในกลุ่มนี้จะถูกลบด้วย</p>
              </div>
              <div className="flex border-t border-base-200">
                <button
                  className="flex-1 py-4 text-base font-medium text-base-content/70 hover:bg-base-200 transition-colors"
                  onClick={() => setDeleteGroupConfirm(null)}
                >
                  ยกเลิก
                </button>
                <div className="w-px bg-base-200" />
                <button
                  className="flex-1 py-4 text-base font-medium text-error hover:bg-error/10 transition-colors"
                  onClick={() => handleDeleteGroup(deleteGroupConfirm.status_group_id)}
                >
                  ลบ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusPage;
