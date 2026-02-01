import { useState } from "react";
import Notification from "../../Notification/Notification";
import { PostAddCarSize } from "../../Modules/Api";

const AdminAddCarSize = () => {
  const [errors, setErrors] = useState([]);
  const [notificationKey, setNotificationKey] = useState(0);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    status: "",
  });
  const [data, setData] = useState({
    size: "",
    description: "",
  });

  const handleAdd = (e) => {
    e.preventDefault();
    PostAddCarSize(data).then(({ status, msg }) => {
      if (status === "SUCCESS") {
        setNotification({
          show: true,
          status: status,
          message: data.size + " " + msg,
        });
        setErrors([]);
      } else if (status === "WARNING") {
        setErrors(msg);
        setData({ ...data, size: "" });
      } else if (status === "ERROR") {
        setNotification({
          show: true,
          status: status,
          message: msg,
        });
      }
      setNotificationKey((prev) => prev + 1);
    });
  };

  const handleReset = () => {
    setData({ size: "", description: "" });
    setErrors("");
  };

  return (
    <div className="space-y-4">
      {notification.show === true && (
        <Notification
          key={notificationKey}
          message={notification.message}
          status={notification.status}
        />
      )}
      <form onSubmit={handleAdd}>
        <div className="border p-4 bg-base-100 space-y-4 items-center">
          <div className="flex flex-col md:flex-row gap-2 md:items-center font-semibold">
            <span className="w-32">Size</span>
            <input
              type="text"
              value={data.size}
              className={`input input-bordered w-full max-w-md ${
                !data.size ? `input-error` : ``
              }`}
              onChange={(e) => {
                setData({ ...data, size: e.target.value });
              }}
              required
            />
          </div>
          {errors && <p className="text-red-500 text-md">{errors}</p>}
          <div className="flex flex-col md:flex-row gap-2 md:items-center font-semibold">
            <span className="w-32 flex flex-col leading-tight">
              <span>Description</span>
              <span className="text-xs text-success">(optional)</span>
            </span>
            <input
              type="text"
              value={data.description || ""}
              className="input input-bordered w-full max-w-md"
              onChange={(e) => {
                setData({ ...data, description: e.target.value });
              }}
            />
          </div>

          <div className="flex gap-2 mt-4">
            <button type="submit" className="btn btn-success text-white">
              SUBMIT
            </button>
            <button type="button" className="btn" onClick={handleReset}>
              CANCEL
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminAddCarSize;
