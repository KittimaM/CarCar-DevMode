import { useEffect, useState } from "react";
import {
  GetAllAdminRole,
  UpdateStaffUser,
  GetAllBranch,
} from "../../Modules/Api";
import Notification from "../../Notification/Notification";

const StaffEditPage = ({ editItem, onBack, onSuccess }) => {
  const [branch, setBranch] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [errors, setErrors] = useState([]);
  const [notificationKey, setNotificationKey] = useState(0);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    status: "",
  });
  const [data, setData] = useState({
    ...editItem,
    password: "",
    isChangePassword: false,
  });

  useEffect(() => {
    GetAllAdminRole().then(({ status, msg }) => {
      if (status === "SUCCESS") {
        setRoleList(msg);
      }
    });
    GetAllBranch().then(({ status, msg }) => {
      if (status === "SUCCESS") {
        setBranch(msg);
      }
    });
  }, []);

  const handleEdit = (e) => {
    e.preventDefault();
    UpdateStaffUser(data).then(({ status, msg }) => {
      if (status === "SUCCESS") {
        setErrors([]);
        onSuccess?.(msg);
      } else if (status === "WARNING") {
        setErrors(msg);
        setData({ ...data, username: editItem.username });
        setNotification({ show: true, status, message: msg });
        setNotificationKey((prev) => prev + 1);
      } else {
        setNotification({ show: true, status, message: msg });
        setNotificationKey((prev) => prev + 1);
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
      <form onSubmit={handleEdit}>
        <div className="border p-4 bg-base-100 space-y-4 items-center">
          <div className="flex flex-col md:flex-row gap-2 md:items-center font-semibold">
            <span className="w-32">Username</span>
            <input
              type="text"
              value={data.username}
              className={`input input-bordered w-full max-w-md ${
                !data.username ? `input-error` : ``
              }`}
              onChange={(e) => {
                setData({ ...data, username: e.target.value });
              }}
              required
            />
          </div>
          {errors && <p className="text-red-500 text-md">{errors}</p>}
          <div className="flex flex-col md:flex-row gap-2 md:items-center font-semibold">
            <span className="w-32">Name</span>
            <input
              type="text"
              value={data.name}
              className={`input input-bordered w-full max-w-md ${
                !data.name ? `input-error` : ``
              }`}
              onChange={(e) => {
                setData({ ...data, name: e.target.value });
              }}
              required
            />
          </div>

          <div className="flex flex-col md:flex-row gap-2 md:items-center font-semibold">
            <input
              type="checkbox"
              checked={!data.isChangePassword}
              className="checkbox checkbox-success"
              onChange={(e) =>
                setData({ ...data, isChangePassword: !data.isChangePassword })
              }
            />

            {!data.isChangePassword ? (
              <span>use same password</span>
            ) : (
              <>
                <span className="w-32">Password</span>
                <input
                  type="password"
                  value={data.password}
                  className={`input input-bordered w-full max-w-md ${
                    !data.password ? `input-error` : ``
                  }`}
                  onChange={(e) => {
                    setData({ ...data, password: e.target.value });
                  }}
                  required
                />
              </>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-2 md:items-center font-semibold">
            <span className="w-32">Role</span>
            <select
              value={data.role_id}
              className={`select w-full select-bordered max-w-md ${
                !data.role_id ? `select-error` : ``
              }`}
              onChange={(e) => setData({ ...data, role_id: e.target.value })}
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

          <div className="flex flex-col md:flex-row gap-2 md:items-center font-semibold">
            <span className="w-32">Branch</span>
            <select
              value={data.branch_id}
              className={`select w-full select-bordered max-w-md ${
                !data.branch_id ? `select-error` : ``
              }`}
              onChange={(e) => setData({ ...data, branch_id: e.target.value })}
              required
            >
              <option disabled={true} value="">
                Pick A Branch
              </option>
              {branch &&
                branch.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex gap-2 mt-4">
            <button type="submit" className="btn btn-success text-white">
              SUBMIT
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => onBack?.()}
            >
              CANCEL
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default StaffEditPage;
