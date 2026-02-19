import { useState } from "react";
import { UpdateCarSize } from "../../Modules/Api";
import Notification from "../../Notification/Notification";

const CarSizeEditPage = ({ editItem, onBack, onSuccess }) => {
  const [data, setData] = useState(editItem);
  const [errors, setErrors] = useState([]);
  const [notificationKey, setNotificationKey] = useState(0);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    status: "",
  });

  const handleEditCarSize = (e) => {
    e.preventDefault();
    UpdateCarSize(data).then(({ status, msg }) => {
      if (status === "SUCCESS") {
        setErrors([]);
        onSuccess?.(data.size + " " + msg);
      } else {
        setNotification({ show: true, status, message: status === "ERROR" ? msg : data.size + " " + msg });
        setNotificationKey((prev) => prev + 1);
        if (status === "WARNING") { setErrors(msg); setData({ ...data, size: editItem.size }); }
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
      <form onSubmit={handleEditCarSize}>
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
              onClick={() => { setData(editItem); setErrors([]); onBack?.(); }}
            >
              CANCEL
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CarSizeEditPage;
