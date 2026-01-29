import { useState } from "react";
import Notification from "../../Notification/Notification";
import { PostAddCarSize } from "../../Api";

const AdminAddCarSize = () => {
  const [size, setSize] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState([]);
  const [notificationKey, setNotificationKey] = useState(0);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    status: "",
  });

  const handleAddCarSize = (e) => {
    e.preventDefault();
    const jsonData = {
      size,
      description,
    };

    PostAddCarSize(jsonData).then(({ status, msg }) => {
      if (status === "SUCCESS") {
        setNotification({
          show: true,
          status: status,
          message: size + " " + msg,
        });
        setErrors([]);
      } else if (status === "WARNING") {
        setErrors(msg);
        setSize("");
      }
      setNotificationKey((prev) => prev + 1);
    });
  };

  const handleReset = () => {
    setSize("");
    setDescription("");
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
      <form onSubmit={handleAddCarSize}>
        <div className="border p-4 bg-base-100 space-y-4 items-center">
          <div className="flex flex-col md:flex-row gap-2 md:items-center font-semibold">
            <span className="w-32">Size</span>
            <input
              type="text"
              value={size}
              className={`input input-bordered w-full max-w-md ${!size ? `input-error` : ``}`}
              onChange={(e) => {
                setSize(e.target.value);
              }}
              required
            />
          </div>
          {errors && <p className="text-red-500 text-md">{errors}</p>}
          <div className="flex flex-col md:flex-row gap-2 md:items-center font-semibold">
            <span className="w-32">Description</span>
            <input
              type="text"
              value={description}
              className={`input input-bordered w-full max-w-md ${!description ? `input-error` : ``}`}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              required
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
