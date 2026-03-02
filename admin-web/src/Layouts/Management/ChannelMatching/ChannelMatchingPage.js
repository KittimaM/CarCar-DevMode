import React, { useEffect, useState, useMemo } from "react";
import Notification from "../../Notification/Notification";
import {
  PostDeleteChannelMatching,
  GetAllChannelMatching,
  PutUpdateChannelMatchingAvailable,
} from "../../Modules/Api";
import ChannelMatchingAddPage from "./ChannelMatchingAddPage";
import ChannelMatchingEditPage from "./ChannelMatchingEditPage";

const SortIcon = ({ direction }) => {
  if (!direction) {
    return (
      <svg className="w-4 h-4 text-base-content/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M8 9l4-4 4 4M16 15l-4 4-4-4" />
      </svg>
    );
  }
  if (direction === "asc") {
    return (
      <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M8 14l4-4 4 4" />
      </svg>
    );
  }
  return (
    <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 10l4 4 4-4" />
    </svg>
  );
};

const ChannelMatchingPage = ({ data }) => {
  const { labelValue, permission, code } = data;
  const actions = permission.find((p) => p.code === code).permission_actions;
  const [channel, setChannel] = useState([]);
  const [viewMode, setViewMode] = useState("list");
  const [editItem, setEditItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [notificationKey, setNotificationKey] = useState(0);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    status: "",
  });

  const fetchChannelMatching = () => {
    GetAllChannelMatching().then((data) => {
      const { status, msg } = data;
      if (status === "SUCCESS") {
        setChannel(msg);
      } else if (status === "NO DATA") {
        setChannel([]);
      }
    });
  };

  useEffect(() => {
    fetchChannelMatching();
  }, []);

  const handleDelete = (channel_id, service_car_size_id) => {
    PostDeleteChannelMatching({ channel_id, service_car_size_id }).then(({ status, msg }) => {
      setNotification({
        show: true,
        message: msg,
        status: status,
      });
      setNotificationKey((prev) => prev + 1);
      setDeleteConfirm(null);
      if (status === "SUCCESS") {
        fetchChannelMatching();
      }
    });
  };

  const handleAvailable = (channel_id, service_car_size_id, is_available) => {
    const newAvailable = is_available === 1 ? 0 : 1;
    PutUpdateChannelMatchingAvailable({
      channel_id,
      service_car_size_id,
      is_available: newAvailable,
    }).then(({ status, msg }) => {
      setNotification({
        show: true,
        message: msg,
        status: status,
      });
      setNotificationKey((prev) => prev + 1);
      if (status === "SUCCESS") {
        fetchChannelMatching();
      }
    });
  };

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        if (prev.direction === "asc") return { key, direction: "desc" };
        if (prev.direction === "desc") return { key: null, direction: null };
      }
      return { key, direction: "asc" };
    });
  };

  const filteredAndSortedChannels = useMemo(() => {
    let result = channel.filter(
      (c) =>
        c.channel_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.branch_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.service_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig.key && sortConfig.direction) {
      result = [...result].sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        
        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
        }
        
        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();
        if (sortConfig.direction === "asc") {
          return aStr.localeCompare(bStr);
        }
        return bStr.localeCompare(aStr);
      });
    }

    return result;
  }, [channel, searchTerm, sortConfig]);

  const SortableHeader = ({ label, sortKey }) => (
    <th
      className="font-semibold cursor-pointer select-none hover:bg-base-300/50 transition-colors"
      onClick={() => handleSort(sortKey)}
    >
      <div className="flex items-center gap-1">
        {label}
        <SortIcon direction={sortConfig.key === sortKey ? sortConfig.direction : null} />
      </div>
    </th>
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
      <div className="px-4 sm:px-8 py-6 sm:py-8 shadow-md bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-base-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs sm:text-sm font-semibold text-primary uppercase tracking-wider mb-1 sm:mb-2">{labelValue}</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-base-content">
              {viewMode === "list" && "Channel Matching List"}
              {viewMode === "add" && "Create New Channel"}
              {viewMode === "edit" && "Edit Channel"}
            </h1>
          </div>

          <div className="flex gap-2">
            {viewMode !== "list" && (
              <button
                className="btn btn-ghost btn-sm sm:btn-md gap-2"
                onClick={() => {
                  setViewMode("list");
                  setEditItem(null);
                  fetchChannelMatching();
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                <span className="hidden sm:inline">Back to List</span>
                <span className="sm:hidden">Back</span>
              </button>
            )}
            {actions.includes("add") && viewMode === "list" && (
              <button
                className="btn btn-primary btn-sm sm:btn-md gap-2 shadow-md"
                onClick={() => setViewMode("add")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                <span className="hidden sm:inline">Add Channel</span>
                <span className="sm:hidden">Add</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-8">
        {viewMode === "add" && (
          <ChannelMatchingAddPage
            onBack={() => {
              setViewMode("list");
              fetchChannelMatching();
            }}
            onSuccess={(msg) => {
              setNotification({
                show: true,
                message: msg,
                status: "SUCCESS",
              });
              setNotificationKey((prev) => prev + 1);
              setViewMode("list");
              fetchChannelMatching();
            }}
          />
        )}

        {viewMode === "edit" && editItem && (
          <ChannelMatchingEditPage
            editItem={editItem}
            channelList={channel}
            onBack={() => {
              setEditItem(null);
              setViewMode("list");
              fetchChannelMatching();
            }}
            onSuccess={(msg) => {
              setNotification({
                show: true,
                message: msg,
                status: "SUCCESS",
              });
              setNotificationKey((prev) => prev + 1);
              setEditItem(null);
              setViewMode("list");
              fetchChannelMatching();
            }}
          />
        )}

        {viewMode === "list" && (
          <div className="max-w-full">
            {/* Search & Stats */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by channel, branch, or service..."
                  className="input input-bordered w-full pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <p className="text-sm text-base-content/60">
                {filteredAndSortedChannels.length} {filteredAndSortedChannels.length === 1 ? "channel" : "channels"} found
              </p>
            </div>

            {/* Table Card */}
            <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr className="bg-base-200/50">
                      <th className="font-semibold w-12 text-center">#</th>
                      <SortableHeader label="Status" sortKey="is_available" />
                      <SortableHeader label="Channel" sortKey="channel_name" />
                      <SortableHeader label="Branch" sortKey="branch_name" />
                      <SortableHeader label="Service" sortKey="service_name" />
                      <SortableHeader label="Car Size" sortKey="car_size" />
                      <th className="font-semibold">Mon</th>
                      <th className="font-semibold">Tue</th>
                      <th className="font-semibold">Wed</th>
                      <th className="font-semibold">Thu</th>
                      <th className="font-semibold">Fri</th>
                      <th className="font-semibold">Sat</th>
                      <th className="font-semibold">Sun</th>
                      {(actions.includes("edit") || actions.includes("delete")) && (
                        <th className="font-semibold text-right">Actions</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedChannels.length > 0 ? (
                      filteredAndSortedChannels.map((c, index) => (
                        <tr key={`${c.channel_id}-${c.service_car_size_id}`} className="hover:bg-base-50">
                          <td className="text-center text-base-content/60 font-medium">{index + 1}</td>
                          <td>
                            <button
                              type="button"
                              disabled={!actions.includes("edit")}
                              onClick={() => handleAvailable(c.channel_id, c.service_car_size_id, c.is_available)}
                              className={`badge badge-sm gap-1 cursor-pointer hover:opacity-80 ${
                                c.is_available === 1 ? "badge-success" : "badge-error"
                              }`}
                              title={c.is_available === 1 ? "Click to disable" : "Click to enable"}
                            >
                              {c.is_available === 1 ? "Active" : "Inactive"}
                            </button>
                          </td>
                          <td className="font-medium">{c.channel_name}</td>
                          <td>{c.branch_name}</td>
                          <td>{c.service_name}</td>
                          <td>{c.car_size ?? "-"}</td>
                          <td className="text-sm text-base-content/70">{c.Monday ?? "-"}</td>
                          <td className="text-sm text-base-content/70">{c.Tuesday ?? "-"}</td>
                          <td className="text-sm text-base-content/70">{c.Wednesday ?? "-"}</td>
                          <td className="text-sm text-base-content/70">{c.Thursday ?? "-"}</td>
                          <td className="text-sm text-base-content/70">{c.Friday ?? "-"}</td>
                          <td className="text-sm text-base-content/70">{c.Saturday ?? "-"}</td>
                          <td className="text-sm text-base-content/70">{c.Sunday ?? "-"}</td>
                          {(actions.includes("edit") || actions.includes("delete")) && (
                            <td className="text-right">
                              <div className="flex justify-end gap-1">
                                {actions.includes("edit") && (
                                  <button
                                    className="btn btn-ghost btn-square btn-sm"
                                    onClick={() => {
                                      setEditItem(c);
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
                                    onClick={() => setDeleteConfirm(c)}
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
                          colSpan={actions.includes("edit") || actions.includes("delete") ? 14 : 13}
                          className="text-center py-12 text-base-content/50"
                        >
                          {searchTerm ? "No channels match your search" : "No channel matching available"}
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
                  คุณต้องการลบ <span className="font-semibold text-error">"{deleteConfirm.channel_name} - {deleteConfirm.service_name}"</span> หรือไม่?
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
                  onClick={() => handleDelete(deleteConfirm.channel_id, deleteConfirm.service_car_size_id)}
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

export default ChannelMatchingPage;
