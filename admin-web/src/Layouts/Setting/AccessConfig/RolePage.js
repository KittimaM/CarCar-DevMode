import { useEffect, useState } from "react";
import { DeleteRole, GetAllAdminRole } from "../../Modules/Api";
import Notification from "../../Notification/Notification";
import RoleAddPage from "./RoleAddPage";
import RoleEditPage from "./RoleEditPage";

const RolePage = ({ data }) => {
  const { labelValue, permission, code } = data;
  const actions = permission.find((p) => p.code === code).permission_actions;
  const [roleList, setRoleList] = useState([]);
  const [viewMode, setViewMode] = useState("list");
  const [editItem, setEditItem] = useState(null);
  const [notificationKey, setNotificationKey] = useState(0);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    status: "",
  });
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchAllRole = () => {
    GetAllAdminRole().then(({ status, msg }) => {
      if (status === "SUCCESS") {
        setRoleList(msg);
      } else if (status === "NO DATA") {
        setRoleList([]);
      }
    });
  };

  useEffect(() => {
    fetchAllRole();
  }, []);

  const handleDeleteRole = (id, name) => {
    DeleteRole({ id }).then(({ status, msg }) => {
      if (status === "SUCCESS") {
        setNotification({
          show: true,
          message: msg,
          status: status,
        });
        fetchAllRole();
      } else if (status === "ERROR") {
        if (msg === "IN USE") {
          setNotification({
            show: true,
            message: `${name} is currently in use`,
            status: status,
          });
        }
      }
      setNotificationKey((prev) => prev + 1);
    });
  };

  return (
    <div className="flex flex-col h-full bg-base-100">
      {notification.show && (
        <Notification
          key={notificationKey}
          message={notification.message}
          status={notification.status}
        />
      )}

      <div className="px-8 py-8 shadow-md bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-base-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">{labelValue}</p>
            <h1 className="text-3xl font-bold text-base-content">
              {viewMode === "list" && "Role List"}
              {viewMode === "add" && "Create New Role"}
              {viewMode === "edit" && "Edit Role"}
            </h1>
          </div>

          {viewMode === "list" && actions.includes("add") && (
            <button
              className="btn btn-primary gap-2"
              onClick={() => setViewMode("add")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Role
            </button>
          )}

          {viewMode !== "list" && (
            <button
              className="btn btn-ghost gap-2"
              onClick={() => {
                setEditItem(null);
                setViewMode("list");
                fetchAllRole();
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to List
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 shadow-lg">
        {viewMode === "add" && (
          <RoleAddPage
            onBack={() => { setViewMode("list"); fetchAllRole(); }}
            onSuccess={(msg) => {
              setNotification({ show: true, message: msg, status: "SUCCESS" });
              setNotificationKey((prev) => prev + 1);
              setViewMode("list");
              fetchAllRole();
            }}
          />
        )}

        {viewMode === "edit" && editItem && (
          <RoleEditPage
            editItem={editItem}
            onBack={() => { setEditItem(null); setViewMode("list"); fetchAllRole(); }}
            onSuccess={(msg) => {
              setNotification({ show: true, message: msg, status: "SUCCESS" });
              setNotificationKey((prev) => prev + 1);
              setEditItem(null);
              setViewMode("list");
              fetchAllRole();
            }}
          />
        )}

        {viewMode === "list" && (
          <>
            {roleList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-base-content/50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-lg">No roles found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {roleList.map((role) => (
                  <div
                    key={role.id}
                    className="flex items-center justify-between px-6 py-5 bg-base-100 border border-base-200 rounded-xl hover:border-base-300 transition-colors"
                  >
                    <span className="text-lg font-medium text-base-content">{role.name}</span>

                    {(actions.includes("edit") || actions.includes("delete")) && (
                      <div className="flex items-center gap-2">
                        {actions.includes("edit") && (
                          <button
                            className="btn btn-ghost btn-square"
                            onClick={() => {
                              setEditItem(role);
                              setViewMode("edit");
                            }}
                            title="Edit"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                        )}
                        {actions.includes("delete") && role.name.toLowerCase() !== "super user" && (
                          <button
                            className="btn btn-ghost btn-square text-error hover:bg-error/10"
                            onClick={() => setDeleteConfirm(role)}
                            title="Delete"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-base-100 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-error/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-error" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-base-content mb-2">ยืนยันการลบ</h3>
              <p className="text-base-content/70">
                คุณต้องการลบ <span className="font-semibold text-error">"{deleteConfirm.name}"</span> หรือไม่?
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
                onClick={() => {
                  handleDeleteRole(deleteConfirm.id, deleteConfirm.name);
                  setDeleteConfirm(null);
                }}
              >
                ลบ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolePage;
