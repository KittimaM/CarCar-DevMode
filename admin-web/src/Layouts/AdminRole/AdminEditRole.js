import { useEffect, useState } from "react";
import { GetAllModules, GetRolePermissionById, UpdateRole } from "../Api";
import Notification from "../Notification/Notification";

const AdminEditRole = ({ editItem }) => {
  const [modules, setModules] = useState([]);
  const [initialModules, setInitialModules] = useState([]);
  const [roleName, setRoleName] = useState(editItem.name);
  const [errors, setErrors] = useState("");
  const [notificationKey, setNotificationKey] = useState(0);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    status: "",
  });

  const fetchAllModules = () => {
    GetRolePermissionById({ role_id: editItem.id }).then(({ status, msg }) => {
      if (status !== "SUCCESS") return;

      const allowedModules = msg;

      GetAllModules().then(({ status, msg }) => {
        if (status !== "SUCCESS") return;

        const grouped = msg.reduce((acc, row) => {
          if (!acc[row.module_id]) {
            acc[row.module_id] = {
              module_id: row.module_id,
              module_code: row.module_code,
              module_name: row.module_name,
              module_parent_id: row.module_parent_id,
              permissions: [],
            };
          }

          const isAllowed = allowedModules.some(
            (am) =>
              am.module_id === row.module_id &&
              am.permission_id === row.permission_id,
          );

          acc[row.module_id].permissions.push({
            permission_id: row.permission_id,
            permission_code: row.permission_code,
            permission_name: row.permission_name,
            is_allowed: isAllowed ? 1 : 0,
          });

          return acc;
        }, {});

        const result = Object.values(grouped);
        setInitialModules(result);
        setModules(result);
        setRoleName(editItem.name);
      });
    });
  };

  useEffect(() => {
    fetchAllModules();
  }, []);

  const handleAccessConfig = (e) => {
    const { name, value, checked } = e.target;

    setModules((prev) =>
      prev.map((module) => {
        if (module.module_code === name) {
          if (value === "view" && !checked) {
            return {
              ...module,
              permissions: module.permissions.map((p) => ({
                ...p,
                is_allowed: 0,
              })),
            };
          }

          return {
            ...module,
            permissions: module.permissions.map((p) =>
              p.permission_code === value
                ? { ...p, is_allowed: checked ? 1 : 0 }
                : p,
            ),
          };
        }

        const parent = prev.find((m) => m.module_code === name);
        if (
          value === "view" &&
          !checked &&
          parent &&
          module.module_parent_id === parent.module_id
        ) {
          return {
            ...module,
            permissions: module.permissions.map((p) => ({
              ...p,
              is_allowed: 0,
            })),
          };
        }

        return module;
      }),
    );
  };

  const handleEditRole = (event) => {
    event.preventDefault();

    const allowedAccess = modules.flatMap((module) =>
      module.permissions
        .filter((p) => p.is_allowed === 1)
        .map((p) => ({
          module_id: module.module_id,
          permission_id: p.permission_id,
        })),
    );

    if (allowedAccess.length === 0) {
      setErrors("Please select at least 1 module");
      return;
    }

    const jsonData = {
      role_id: editItem.id,
      role_name: roleName,
      allowedAccess,
    };

    UpdateRole(jsonData).then(({ status, msg }) => {
      if (status === "ERROR") {
        if (msg?.code === "ER_DUP_ENTRY") {
          setErrors("Role name duplicated");
        }
      } else if (status === "SUCCESS") {
        setErrors([]);
        setNotification({
          show: true,
          status: status,
          message: `SUCCESSFULLY UPDATE ROLE : ${roleName}`,
        });
        setNotificationKey((prev) => prev + 1);
        fetchAllModules();
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
      <form onSubmit={handleEditRole}>
        <div className="border p-4 bg-base-100 space-y-2">
          <div className="flex justify-between items-center font-semibold">
            ROLE NAME
            <input
              type="text"
              name="roleName"
              value={roleName}
              required
              onChange={(e) => {
                setRoleName(e.target.value);
                setErrors([]);
              }}
              className={`input input-bordered ${
                roleName === "" ? "input-error" : ""
              }`}
            />
          </div>
          {errors && <p className="text-red-500 text-md">{errors}</p>}
        </div>
        {modules
          .filter((m) => m.module_parent_id === 0)
          .map((parent) => {
            const parentView = parent.permissions.find(
              (p) => p.permission_code === "view",
            );

            const childModules = modules.filter(
              (m) => m.module_parent_id === parent.module_id,
            );

            return (
              <div
                key={parent.module_id}
                className="border p-4 bg-base-100 space-y-2"
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{parent.module_name}</span>

                  <input
                    type="checkbox"
                    className="checkbox checkbox-success"
                    value="view"
                    name={parent.module_code}
                    checked={parentView?.is_allowed === 1}
                    onChange={handleAccessConfig}
                  />
                </div>

                {parentView?.is_allowed === 1 && (
                  <div>
                    <p className="text-info text-xs">View enabled</p>

                    {parent.permissions
                      .filter((p) => p.permission_code !== "view")
                      .map((p) => (
                        <div
                          key={p.permission_id}
                          className="border p-4 bg-base-100 space-y-2"
                        >
                          <div className="flex justify-between items-center">
                            {p.permission_name}
                            <input
                              type="checkbox"
                              className="checkbox checkbox-success"
                              value={p.permission_code}
                              name={parent.module_code}
                              checked={p.is_allowed === 1}
                              onChange={handleAccessConfig}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                )}

                {parentView?.is_allowed === 1 && childModules.length > 0 && (
                  <div className="ml-6 mt-3 space-y-3">
                    {childModules.map((child) => {
                      const childView = child.permissions.find(
                        (p) => p.permission_code === "view",
                      );

                      return (
                        <div key={child.module_id} className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">
                              {child.module_name}
                            </span>

                            <input
                              type="checkbox"
                              className="checkbox checkbox-success"
                              value="view"
                              name={child.module_code}
                              checked={childView?.is_allowed === 1}
                              onChange={handleAccessConfig}
                            />
                          </div>

                          {childView?.is_allowed === 1 && (
                            <>
                              <p className="text-info text-xs ml-1">
                                View enabled
                              </p>

                              {child.permissions
                                .filter((p) => p.permission_code !== "view")
                                .map((p) => (
                                  <div
                                    key={p.permission_id}
                                    className="border p-4 bg-base-100 space-y-2"
                                  >
                                    <div className="flex justify-between items-center">
                                      {p.permission_name}
                                      <input
                                        type="checkbox"
                                        className="checkbox checkbox-success"
                                        value={p.permission_code}
                                        name={child.module_code}
                                        checked={p.is_allowed === 1}
                                        onChange={handleAccessConfig}
                                      />
                                    </div>
                                  </div>
                                ))}
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            className="btn"
            onClick={() => {
              setRoleName(editItem.name);
              setErrors([]);
              fetchAllModules();
            }}
          >
            CANCEL
          </button>
          <button type="submit" className="btn btn-success text-white">
            SUBMIT
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminEditRole;
