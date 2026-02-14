import React, { useEffect, useState } from "react";
import Notification from "../../Notification/Notification";
import {
  DeleteChannel,
  GetChannel,
  UpdateChannelAvailable,
} from "../../Modules/Api";
import AdminAddChannel from "./AdminAddChannel";
import AdminEditChannel from "./AdminEditChannel";
import checkIcon from "../../../assets/green-checkmark-line-icon.svg";
import unCheckIcon from "../../../assets/red-x-line-icon.svg";

const AdminChannel = ({ data }) => {
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
    GetChannel().then(({ status, msg }) => {
      if (status == "SUCCESS") {
        const grouped = msg.reduce((acc, row) => {
          if (!acc[row.channel_id]) {
            acc[row.channel_id] = {
              id: row.channel_id,
              name: row.channel_name,
              max_capacity: row.max_capacity,
              is_available: row.channel_is_available,
              services: [],
              schedule: [],
            };
          }

          const isServiceExist = acc[row.channel_id].services.some(
            (s) => s.service_id === row.service_id,
          );

          if (!isServiceExist) {
            acc[row.channel_id].services.push({
              service_id: row.service_id,
              service_name: row.service_name,
              car_size: row.car_size,
            });
          }

          if (row.day_of_week) {
            const hasDay = acc[row.channel_id].schedule.some(
              (s) => s.day_of_week === row.day_of_week,
            );
            if (!hasDay) {
              const st =
                row.start_time != null
                  ? String(row.start_time).substring(0, 5)
                  : "";
              const et =
                row.end_time != null
                  ? String(row.end_time).substring(0, 5)
                  : "";
              acc[row.channel_id].schedule.push({
                day_of_week: row.day_of_week,
                start_time: st,
                end_time: et,
              });
            }
          }

          return acc;
        }, {});

        setChannel(Object.values(grouped));
      } else if (status == "NO DATA") {
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
      if (status === "SUCCESS") {
        fetchChannel();
      }
      setNotificationKey((prev) => prev + 1);
    });
  };

  const handleAvailable = (id, name, is_available) => {
    UpdateChannelAvailable({ id: id, is_available: !is_available }).then(
      ({ status, msg }) => {
        setNotification({
          show: true,
          message: msg,
          status: status,
        });
        setNotificationKey((prev) => prev + 1);
        if (status === "SUCCESS") {
          fetchChannel();
        }
      },
    );
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

      {viewMode === "add" && <AdminAddChannel />}
      {viewMode === "edit" && editItem && (
        <AdminEditChannel editItem={editItem} />
      )}

      {viewMode === "list" && (
        <table className="table table-lg">
          <thead>
            <tr>
              <td>Available Status</td>
              <td>Channel</td>
              <td>Service(s)</td>
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
                  <td>
                    <button
                      type="button"
                      onClick={() =>
                        handleAvailable(c.id, c.name, c.is_available)
                      }
                    >
                      {c.is_available === 1 ? (
                        <img alt="" height="15" width="15" src={checkIcon} />
                      ) : (
                        <img alt="" height="15" width="15" src={unCheckIcon} />
                      )}
                    </button>
                  </td>
                  <td>{c.name}</td>
                  <td>
                    {c.services.map((s, i) => (
                      <span key={s.service_id}>
                        {s.service_name}
                        <span className="text-gray-500"> ({s.car_size}), </span>
                      </span>
                    ))}
                  </td>
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
                      ? 5
                      : 4
                  }
                  className="text-center"
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

export default AdminChannel;
