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
  });

  const handleAdd = (e) => {
    e.preventDefault();
    PostAddCarSize(data).then(({ status, msg }) => {
      setNotification({
        show: true,
        status: status,
        message: msg,
      });
      setNotificationKey((prev) => prev + 1);
      if (status === "SUCCESS") {
        setErrors([]);
      } else if (status === "WARNING") {
        setErrors(msg);
        setData({ size: "" });
      }
    });
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
          <div className="flex gap-2 mt-4">
            <button type="submit" className="btn btn-success text-white">
              SUBMIT
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => {
                setData({ size: "" });
                setErrors("");
              }}
            >
              CANCEL
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminAddCarSize;
