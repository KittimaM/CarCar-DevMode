import { useEffect, useState } from "react";
import { GetCarSizeById, UpdateCarSize } from "../../Api";
import Notification from "../../Notification/Notification";

const AdminEditCarSize = ({ editItem }) => {
  const [size, setSize] = useState(editItem.size);
  const [description, setDescription] = useState(editItem.description);
  const [errors, setErrors] = useState([]);
  const [notificationKey, setNotificationKey] = useState(0);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    status: "",
  });

  const fetchCarSizeById = () => {
    GetCarSizeById({ id: editItem, size, description }).then(
      ({ status, msg }) => {
        if (status === "SUCCESS") {
          setSize(msg.size);
          setDescription(msg.description);
        }
      },
    );
  };

  useEffect(() => {
    fetchCarSizeById();
  }, []);

  const handleEditCarSize = (e) => {
    e.preventDefault();
    const jsonData = {
      id: editItem.id,
      size,
      description,
    };
    UpdateCarSize(jsonData).then(({ status, msg }) => {
      if (status === "SUCCESS") {
        setNotification({
          show: true,
          status: status,
          message: size + " " + msg,
        });
        setErrors([]);
      } else if (status === "WARNING") {
        setErrors(msg);
        setSize(editItem.size);
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
    setSize(editItem.size);
    setDescription(editItem.description);
    setErrors([]);
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

export default AdminEditCarSize;
