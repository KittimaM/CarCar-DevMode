import React, { useEffect, useState } from "react";
import Notification from "../../Notification/Notification";
import {
  PostDeleteServiceRates,
  GetAllChannelMatching,
} from "../../Modules/Api";
import ChannelMatchingAddPage from "./ChannelMatchingAddPage";
import ChannelMatchingEditPage from "./ChannelMatchingEditPage";
import checkIcon from "../../../assets/green-checkmark-line-icon.svg";
import unCheckIcon from "../../../assets/red-x-line-icon.svg";

const ChannelMatchingPage = ({ data }) => {
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

  const handleDelete = (id) => {
    PostDeleteServiceRates({ id }).then(({ status, msg }) => {
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

  const handleAvailable = (id) => {};

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
            fetchChannelMatching();
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

      {viewMode === "add" && <ChannelMatchingAddPage />}
      {viewMode === "edit" && editItem && (
        <ChannelMatchingEditPage editItem={editItem} />
      )}

      {viewMode === "list" && (
        <div className="h-screen overflow-y-auto">
          <div className="overflow-x-auto">
            <table className="table table-lg table-pin-rows">
              <thead>
                <tr>
                  <th>Available Status</th>
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
                {channel.length > 0 ? (
                  channel.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <button
                          type="button"
                          disabled={!actions.includes("edit")}
                          onClick={() => handleAvailable(c.id, c.is_available)}
                        >
                          {c.is_available === 1 ? (
                            <img
                              alt=""
                              height="15"
                              width="15"
                              src={checkIcon}
                            />
                          ) : (
                            <img
                              alt=""
                              height="15"
                              width="15"
                              src={unCheckIcon}
                            />
                          )}
                        </button>
                      </td>
                      <td>{c.channel_name}</td>
                      <td>{c.branch_name}</td>
                      <td>{c.service_name}</td>
                      {(actions.includes("edit") ||
                        actions.includes("delete")) && (
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
                          ? 7
                          : 6
                      }
                      className="text-center text-gray-400"
                    >
                      No Channel Available
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

export default ChannelMatchingPage;
