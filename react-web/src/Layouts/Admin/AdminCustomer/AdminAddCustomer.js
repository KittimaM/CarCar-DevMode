import { useState } from "react";
import Notification from "../../Notification/Notification";
import { PostAddCustomer } from "../../Api";

const AdminAddCustomer = () => {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [notificationKey, setNotificationKey] = useState(0);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    status: "",
  });

  const handleAddUser = (e) => {
    e.preventDefault();
    const jsonData = {
      phone: phone,
      name: name,
      password: password,
    };
    PostAddCustomer(jsonData).then(({ status, msg }) => {
      if (status == "SUCCESS") {
        setNotification({
          show: true,
          status: status,
          message: `Successfully Add ${name}`,
        });
        setErrors([]);
      } else if (status == "WARNING") {
        setErrors(msg);
        setPhone("");
      }
      setNotificationKey((prev) => prev + 1);
    });
  };

  const handleReset = () => {
    setPhone("");
    setName("");
    setPassword("");
    setErrors([]);
  };
  return (
    <div className="space-y-4">
      {notification.show == true && (
        <Notification
          key={notificationKey}
          message={notification.message}
          status={notification.status}
        />
      )}
      <form onSubmit={handleAddUser}>
        <div className="border p-4 bg-base-100 space-y-4 items-center">
          <div className="flex flex-col md:flex-row gap-2 md:items-center font-semibold">
            <span className="w-32">Phone</span>
            <input
              type="tel"
              inputMode="numeric"
              value={phone}
              className={`input validator tabular-nums input-bordered w-full max-w-md ${!phone ? `input-error` : ``}`}
              onChange={(e) => {
                let value = e.target.value.replace(/[^0-9]/g, "");
                if (value.length > 10) {
                  value = value.slice(0, 10);
                }
                setPhone(value);
              }}
              required
            />
          </div>
          {errors && <p className="text-red-500 text-md">{errors}</p>}
          <div className="flex flex-col md:flex-row gap-2 md:items-center font-semibold">
            <span className="w-32">Name</span>
            <input
              type="text"
              value={name}
              className={`input input-bordered w-full max-w-md ${!name ? `input-error` : ``}`}
              onChange={(e) => {
                const onlyLetters = e.target.value.replace(/[^A-Za-z ]/g, "");
                setName(onlyLetters);
              }}
              required
            />
          </div>

          <div className="flex flex-col md:flex-row gap-2 md:items-center font-semibold">
            <span className="w-32">Password</span>
            <input
              type="password"
              value={password}
              className={`input input-bordered w-full max-w-md ${!password ? `input-error` : ``}`}
              onChange={(e) => {
                setPassword(e.target.value);
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

export default AdminAddCustomer;
