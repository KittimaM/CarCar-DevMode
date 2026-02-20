import React, { useEffect, useState } from "react";
import Notification from "../../Notification/Notification";
import { DeleteChannel, GetAllChannel } from "../../Modules/Api";
import AdminAddChannel from "./ChannelAddPage";
import AdminEditChannel from "./ChannelEditPage";

const ChannelPage = ({ data }) => {
  const { labelValue, permission, code } = data;
  const actions = permission.find((p) => p.code === code).permission_actions;
  const [channel, setChannel] = useState([]);
  const [viewMode, setViewMode] = useState("list");
  const [editItem, setEditItem] = useState(null);
  const [notificationKey, setNotificationKey] = useState(0);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    status: "",
  });

  const fetchChannel = () => {
    GetAllChannel().then(({ status, msg }) => {
      if (status === "SUCCESS") {
        setChannel(msg);
      } else if (status === "NO DATA") {
        setChannel([]);
      }
    });
  };

  useEffect(() => {
    fetchChannel();
  }, []);

  const handleDelete = (id) => {
    DeleteChannel({ id }).then(({ status, msg }) => {
      setNotification({
        show: true,
        message: msg,
        status: status,
      });
      setNotificationKey((prev) => prev + 1);
      if (status === "SUCCESS") {
        fetchChannel();
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
            {viewMode === "list" && <li className="text-xl">CHANNEL LIST</li>}
            {viewMode === "add" && (
              <li className="text-xl">CREATE NEW CHANNEL</li>
            )}
            {viewMode === "edit" && <li className="text-xl">EDIT CHANNEL</li>}
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
            fetchChannel();
          }}
        >
          Channel List
        </button>

        {actions.includes("add") && (
          <button
            className={`btn btn-wide font-bold ${
              viewMode === "add" ? "btn-primary" : "btn-outline"
            }`}
            onClick={() => setViewMode("add")}
          >
            + Create New Channel
          </button>
        )}
      </div>

      {viewMode === "add" && (
        <AdminAddChannel
          onBack={() => {
            setViewMode("list");
            fetchChannel();
          }}
          onSuccess={(msg) => {
            setNotification({
              show: true,
              message: msg,
              status: "SUCCESS",
            });
            setNotificationKey((prev) => prev + 1);
            setViewMode("list");
            fetchChannel();
          }}
        />
      )}
      {viewMode === "edit" && editItem && (
        <AdminEditChannel
          editItem={editItem}
          onBack={() => {
            setEditItem(null);
            setViewMode("list");
            fetchChannel();
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
            fetchChannel();
          }}
        />
      )}

      {viewMode === "list" && (
        <table className="table table-lg">
          <thead>
            <tr>
              <td>Branch</td>
              <td>Channel</td>
              <td>Max Capacity</td>
              {(actions.includes("edit") || actions.includes("delete")) && (
                <th className="text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {channel.length > 0 ? (
              channel.map((c) => (
                <tr key={c.id}>
                  <td>{c.branch_name}</td>
                  <td>{c.name}</td>
                  <td>{c.max_capacity}</td>
                  {(actions.includes("edit") || actions.includes("delete")) && (
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        {actions.includes("delete") && (
                          <button
                            className="btn btn-error text-white"
                            onClick={() => handleDelete(c.id)}
                          >
                            Delete
                          </button>
                        )}
                        {actions.includes("edit") && (
                          <button
                            className="btn btn-warning"
                            onClick={() => {
                              setEditItem(c);
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
                      ? 4
                      : 3
                  }
                  className="text-center text-gray-400"
                >
                  No Channel Available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ChannelPage;
