import { useEffect, useState } from "react";
import { GetAllAdminRole, PostAddStaffUser } from "../../Api";
import Notification from "../../Notification/Notification";

const AdminAddStaff = () => {
  const [roleList, setRoleList] = useState([]);
  const [userName, setUserName] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [errors, setErrors] = useState([]);
  const [notificationKey, setNotificationKey] = useState(0);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    status: "",
  });

  const fetchAllRole = () => {
    GetAllAdminRole().then(({ status, msg }) => {
      if (status == "SUCCESS") {
        setRoleList(msg);
      }
    });
  };
  useEffect(() => {
    fetchAllRole();
  }, []);

  const handleAddUser = (e) => {
    e.preventDefault();
    const jsonData = {
      username: userName,
      name: name,
      password: password,
      role_id: role,
    };
    PostAddStaffUser(jsonData).then(({ status, msg }) => {
      if (status == "SUCCESS") {
        setNotification({
          show: true,
          status: status,
          message: userName + " " + msg,
        });
        setErrors([]);
      } else if (status == "WARNNING") {
        setErrors(userName + " " + msg);
        setUserName("");
      } else if (status == "ERROR") {
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
    setUserName("");
    setName("");
    setPassword("");
    setRole("");
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
            <span className="w-32">Username</span>
            <input
              type="text"
              value={userName}
              className={`input input-bordered w-full max-w-md ${!userName ? `input-error` : ``}`}
              onChange={(e) => {
                setUserName(e.target.value);
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
          <div className="flex flex-col md:flex-row gap-2 md:items-center font-semibold">
            <span className="w-32">Role</span>
            <select
              value={role}
              className={`select w-full select-bordered max-w-md ${!role ? `select-error` : ``}`}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option disabled={true} value="">
                Pick A Role
              </option>
              {roleList &&
                roleList.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
            </select>
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

export default AdminAddStaff;
