import { useEffect, useState } from "react";
import { GetAdminCustomerCar, DeleteAdminCustomerCar } from "../../Modules/Api";
import Notification from "../../Notification/Notification";
import CustomerCarEditPage from "./CustomerCarEditPage";
import CustomerCarAddPage from "./CustomerCarAddPage";

const CustomerCarPage = ({ data }) => {
  const { labelValue, permission, code } = data;
  const actions = permission.find((p) => p.code === code).permission_actions;
  const [viewMode, setViewMode] = useState("list");
  const [customerCarList, setCustomerCarList] = useState([]);
  const [editItem, setEditItem] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [notificationKey, setNotificationKey] = useState(0);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    status: "",
  });

  const fetchCustomerCar = () => {
    GetAdminCustomerCar().then(({ status, msg }) => {
      if (status === "SUCCESS") {
        setCustomerCarList(msg);
      } else if (status === "NO DATA") {
        setCustomerCarList([]);
      }
    });
  };

  useEffect(() => {
    fetchCustomerCar();
  }, []);

  const handleDelete = (id) => {
    DeleteAdminCustomerCar({ id }).then(({ status, msg }) => {
      setNotification({
        show: true,
        message: msg,
        status: status,
      });
      setNotificationKey((prev) => prev + 1);
      setDeleteConfirm(null);
      if (status === "SUCCESS") {
        fetchCustomerCar();
      }
    });
  };

  const filteredCars = customerCarList.filter(
    (c) =>
      c.plate_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone?.includes(searchTerm) ||
      c.brand?.toLowerCase().includes(searchTerm.toLowerCase())
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
      <div className="px-8 py-8 shadow-md bg-gradient-to-r from-accent/10 via-accent/5 to-transparent border-b border-base-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-accent uppercase tracking-wider mb-2">{labelValue}</p>
            <h1 className="text-3xl font-bold text-base-content">
              {viewMode === "list" && "Vehicle List"}
              {viewMode === "add" && "Add Vehicle"}
              {viewMode === "edit" && "Edit Vehicle"}
            </h1>
          </div>

          <div className="flex gap-2">
            {viewMode !== "list" && (
              <button
                className="btn btn-ghost gap-2"
                onClick={() => {
                  setViewMode("list");
                  setEditItem(null);
                  fetchCustomerCar();
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
                className="btn btn-accent gap-2 shadow-md"
                onClick={() => setViewMode("add")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Vehicle
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {viewMode === "add" && (
          <CustomerCarAddPage
            onBack={() => {
              setViewMode("list");
              fetchCustomerCar();
            }}
            onSuccess={(msg) => {
              setNotification({
                show: true,
                message: msg,
                status: "SUCCESS",
              });
              setNotificationKey((k) => k + 1);
              setViewMode("list");
              fetchCustomerCar();
            }}
          />
        )}

        {viewMode === "edit" && editItem && (
          <CustomerCarEditPage
            editItem={editItem}
            onBack={() => {
              setEditItem(null);
              setViewMode("list");
              fetchCustomerCar();
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
              fetchCustomerCar();
            }}
          />
        )}

        {viewMode === "list" && (
          <div className="max-w-7xl">
            {/* Search & Stats */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by plate, owner, phone, or brand..."
                  className="input input-bordered w-full pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <p className="text-sm text-base-content/60">
                {filteredCars.length} {filteredCars.length === 1 ? "vehicle" : "vehicles"} found
              </p>
            </div>

            {/* Table Card */}
            <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr className="bg-base-200/50">
                      <th className="font-semibold">Owner</th>
                      <th className="font-semibold">Phone</th>
                      <th className="font-semibold">Plate No</th>
                      <th className="font-semibold">Province</th>
                      <th className="font-semibold">Brand / Model</th>
                      <th className="font-semibold">Color</th>
                      <th className="font-semibold">Size</th>
                      {(actions.includes("edit") || actions.includes("delete")) && (
                        <th className="font-semibold text-right">Actions</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCars.length > 0 ? (
                      filteredCars.map((c) => (
                        <tr key={c.id} className="hover:bg-base-50">
                          <td className="font-medium">{c.name}</td>
                          <td className="font-mono text-sm">{c.phone}</td>
                          <td className="font-semibold text-accent">{c.plate_no}</td>
                          <td className="text-base-content/70 text-sm">{c.province}</td>
                          <td>
                            <div>
                              <span className="font-medium">{c.brand}</span>
                              {c.model && <span className="text-base-content/50 text-sm ml-1">/ {c.model}</span>}
                            </div>
                          </td>
                          <td>
                            <span className="badge badge-ghost badge-sm">{c.color}</span>
                          </td>
                          <td>
                            <span className="badge badge-outline badge-sm">{c.size}</span>
                          </td>
                          {(actions.includes("edit") || actions.includes("delete")) && (
                            <td className="text-right">
                              <div className="flex justify-end gap-1">
                                {actions.includes("edit") && (
                                  <button
                                    className="btn btn-ghost btn-sm"
                                    onClick={() => {
                                      setViewMode("edit");
                                      setEditItem(c);
                                    }}
                                  >
                                    Edit
                                  </button>
                                )}
                                {actions.includes("delete") && (
                                  <button
                                    className="btn btn-ghost btn-sm text-error"
                                    onClick={() => setDeleteConfirm(c)}
                                  >
                                    Delete
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
                          colSpan={actions.includes("edit") || actions.includes("delete") ? 8 : 7}
                          className="text-center py-12 text-base-content/50"
                        >
                          {searchTerm ? "No vehicles match your search" : "No vehicles available"}
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
                  คุณต้องการลบ <span className="font-semibold text-error">"{deleteConfirm.plate_no}"</span> ({deleteConfirm.brand}) หรือไม่?
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

export default CustomerCarPage;
