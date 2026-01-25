import { useEffect, useState } from "react";
import { GetAllAdminRole, GetStaffUserById, UpdateStaffUser } from "../../Api";
import Notification from "../../Notification/Notification";

const AdminEditStaff = ({ editItem }) => {
  const [roleList, setRoleList] = useState([]);
  const [userName, setUserName] = useState(editItem.username);
  const [name, setName] = useState(editItem.name);
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(editItem.role_id);
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [errors, setErrors] = useState([]);
  const [notificationKey, setNotificationKey] = useState(0);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    status: "",
  });

  const fetchUserbyId = () => {
    GetStaffUserById({ id: editItem }).then(({ status, msg }) => {
      if (status == "SUCCESS") {
        setUserName(msg.username);
        setName(msg.name);
        setRole(msg.role_id);
      }
    });
  };

  const fetchAllRole = () => {
    GetAllAdminRole().then(({ status, msg }) => {
      if (status == "SUCCESS") {
        setRoleList(msg);
      }
    });
  };

  useEffect(() => {
    fetchUserbyId();
    fetchAllRole();
  }, []);

  const handleReset = () => {
    setUserName(editItem.username);
    setName(editItem.name);
    setPassword("");
    setRole(editItem.role_id);
    setErrors([]);
    setIsChangePassword(false);
  };

  const handleEditUser = (e) => {
    e.preventDefault();
    const jsonData = {
      id: editItem.id,
      name: name,
      username: userName,
      password: password,
      role_id: role,
      isChangePassword: isChangePassword,
    };

    UpdateStaffUser(jsonData).then(({ status, msg }) => {
      if (status == "SUCCESS") {
        setNotification({
          show: true,
          status: status,
          message: `Successfully Update ${userName}`,
        });
        setErrors([]);
      } else if (status == "WARNING") {
        setErrors(userName + " " + msg);
        setUserName(editItem.username);
      }
      setNotificationKey((prev) => prev + 1);
    });
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
      <form onSubmit={handleEditUser}>
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
                setName(e.target.value);
              }}
              required
            />
          </div>

          <div className="flex flex-col md:flex-row gap-2 md:items-center font-semibold">
            <input
              type="checkbox"
              checked={!isChangePassword}
              className="checkbox checkbox-success"
              onChange={() => setIsChangePassword(!isChangePassword)}
            />

            {!isChangePassword ? (
              <span>use same password</span>
            ) : (
              <>
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
              </>
            )}
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

export default AdminEditStaff;
