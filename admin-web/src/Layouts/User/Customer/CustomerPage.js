import { useEffect, useState } from "react";
import {
  DeleteAdminCustomer,
  GetAdminCustomer,
  UpdateAdminUnlockCustomer,
} from "../../Modules/Api";
import Notification from "../../Notification/Notification";
import CustomerEditPage from "./CustomerEditPage";
import CustomerAddPage from "./CustomerAddPage";

const AdminCustomer = ({ data }) => {
  const { labelValue, permission, code } = data;
  const actions = permission.find((p) => p.code === code).permission_actions;
  const [viewMode, setViewMode] = useState("list");
  const [user, setUser] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [notificationKey, setNotificationKey] = useState(0);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    status: "",
  });

  const fetchCustomer = () => {
    GetAdminCustomer().then((data) => {
      const { status, msg } = data;
      if (status === "SUCCESS") {
        setUser(msg);
      } else if (status === "NO DATA") {
        setUser([]);
      } else {
        console.log(data);
      }
    });
  };

  useEffect(() => {
    fetchCustomer();
  }, []);

  const handleDelete = (id) => {
    DeleteAdminCustomer({ id }).then(({ status, msg }) => {
      setNotification({
        show: true,
        message: msg,
        status: status,
      });
      setNotificationKey((prev) => prev + 1);
      setDeleteConfirm(null);
      if (status === "SUCCESS") {
        fetchCustomer();
      }
    });
  };

  const handleUnLock = (id) => {
    UpdateAdminUnlockCustomer({ id: id }).then(({ status, msg }) => {
      setNotification({
        show: true,
        message: msg,
        status: status,
      });
      setNotificationKey((prev) => prev + 1);
      if (status === "SUCCESS") {
        fetchCustomer();
      }
    });
  };

  const filteredUsers = user.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone?.includes(searchTerm)
  );

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
      <div className="px-8 py-8 shadow-md bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-base-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">{labelValue}</p>
            <h1 className="text-3xl font-bold text-base-content">
              {viewMode === "list" && "Customer List"}
              {viewMode === "add" && "Add Customer"}
              {viewMode === "edit" && "Edit Customer"}
            </h1>
          </div>

          <div className="flex gap-2">
            {viewMode !== "list" && (
              <button
                className="btn btn-ghost gap-2"
                onClick={() => {
                  setViewMode("list");
                  setEditItem(null);
                  fetchCustomer();
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to List
              </button>
            )}
            {actions.includes("add") && viewMode === "list" && (
              <button
                className="btn btn-primary gap-2 shadow-md"
                onClick={() => setViewMode("add")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Customer
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {viewMode === "add" && (
          <CustomerAddPage
            onBack={() => {
              setViewMode("list");
              fetchCustomer();
            }}
            onSuccess={(msg) => {
              setNotification({
                show: true,
                message: msg,
                status: "SUCCESS",
              });
              setNotificationKey((k) => k + 1);
              setViewMode("list");
              fetchCustomer();
            }}
          />
        )}

        {viewMode === "edit" && editItem && (
          <CustomerEditPage
            editItem={editItem}
            onBack={() => {
              setEditItem(null);
              setViewMode("list");
              fetchCustomer();
            }}
            onSuccess={(msg) => {
              setNotification({
                show: true,
                message: msg,
                status: "SUCCESS",
              });
              setNotificationKey((k) => k + 1);
              setEditItem(null);
              setViewMode("list");
              fetchCustomer();
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
                  placeholder="Search by name or phone..."
                  className="input input-bordered w-full pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <p className="text-sm text-base-content/60">
                {filteredUsers.length} {filteredUsers.length === 1 ? "customer" : "customers"} found
              </p>
            </div>

            {/* Table Card */}
            <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr className="bg-base-200/50">
                      <th className="font-semibold">Status</th>
                      <th className="font-semibold">Phone</th>
                      <th className="font-semibold">Name</th>
                      <th className="font-semibold">Locked Reason</th>
                      {(actions.includes("edit") || actions.includes("delete")) && (
                        <th className="font-semibold text-right">Actions</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-base-50">
                          <td>
                            {u.is_locked === 1 ? (
                              <button
                                type="button"
                                onClick={() => handleUnLock(u.id)}
                                className="badge badge-error badge-sm gap-1 cursor-pointer hover:opacity-80"
                                title="Click to unlock"
                              >
                                Locked
                              </button>
                            ) : (
                              <span className="badge badge-success badge-sm">Active</span>
                            )}
                          </td>
                          <td className="font-mono text-sm">{u.phone}</td>
                          <td className="font-medium">{u.name}</td>
                          <td className="text-base-content/60 text-sm">
                            {u.locked_reason || "-"}
                          </td>
                          {(actions.includes("edit") || actions.includes("delete")) && (
                            <td className="text-right">
                              <div className="flex justify-end gap-1">
                                {actions.includes("edit") && (
                                  <button
                                    className="btn btn-ghost btn-square btn-sm"
                                    onClick={() => {
                                      setEditItem(u);
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
                                    onClick={() => setDeleteConfirm(u)}
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
                    ) : (
                      <tr>
                        <td
                          colSpan={actions.includes("edit") || actions.includes("delete") ? 5 : 4}
                          className="text-center py-12 text-base-content/50"
                        >
                          {searchTerm ? "No customers match your search" : "No customers available"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
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
                  onClick={() => handleDelete(deleteConfirm.id)}
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

export default AdminCustomer;
