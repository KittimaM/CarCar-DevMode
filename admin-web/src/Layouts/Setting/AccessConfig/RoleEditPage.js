import { useCallback, useEffect, useState } from "react";
import {
  GetAllModules,
  GetRolePermissionById,
  UpdateRole,
} from "../../Modules/Api";
import Notification from "../../Notification/Notification";

const CustomCheckbox = ({ checked, onChange, name, value }) => (
  <label className="relative cursor-pointer flex-shrink-0">
    <input
      type="checkbox"
      className="sr-only"
      checked={checked}
      onChange={onChange}
      name={name}
      value={value}
    />
    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
      checked 
        ? "bg-success border-success" 
        : "bg-base-100 border-base-300 hover:border-success"
    }`}>
      {checked && (
        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
    </div>
  </label>
);

const RoleEditPage = ({ editItem, onBack, onSuccess }) => {
  const [modules, setModules] = useState([]);
  const [roleName, setRoleName] = useState(editItem.name);
  const [errors, setErrors] = useState("");
  const [notificationKey, setNotificationKey] = useState(0);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    status: "",
  });

  const fetchAllModules = useCallback(() => {
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

        setModules(Object.values(grouped));
        setRoleName(editItem.name);
      });
    });
  }, [editItem.id, editItem.name]);

  useEffect(() => {
    fetchAllModules();
  }, [fetchAllModules]);

  const handleAccessConfig = (e) => {
    const { name, value, checked } = e.target;

    setModules((prev) => {
      const targetModule = prev.find((m) => m.module_code === name);
      
      return prev
        .map((module) => {
          if (module.module_code !== name) return module;

          if (value === "view") {
            return {
              ...module,
              permissions: module.permissions.map((p) => ({
                ...p,
                is_allowed: checked ? 1 : 0,
              })),
            };
          }

          return {
            ...module,
            permissions: module.permissions.map((p) =>
              p.permission_code === value
                ? { ...p, is_allowed: checked ? 1 : 0 }
                : p
            ),
          };
        })
        .map((module) => {
          if (
            value === "view" &&
            module.module_parent_id === targetModule?.module_id
          ) {
            return {
              ...module,
              permissions: module.permissions.map((p) => ({
                ...p,
                is_allowed: checked ? 1 : 0,
              })),
            };
          }

          return module;
        });
    });
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
      if (status === "SUCCESS") {
        setErrors([]);
        onSuccess?.(`SUCCESSFULLY UPDATE ROLE : ${roleName}`);
      } else if (status === "ERROR") {
        if (msg?.code === "ER_DUP_ENTRY") {
          setErrors("Role name duplicated");
        }
        setNotification({ show: true, status, message: msg });
        setNotificationKey((prev) => prev + 1);
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4">
      {notification.show === true && (
        <Notification
          key={notificationKey}
          message={notification.message}
          status={notification.status}
        />
      )}
      <form onSubmit={handleEditRole} className="space-y-4">
        <div className="bg-base-100 border border-base-200 rounded-lg p-4">
          <label className="block">
            <span className="text-sm font-semibold uppercase tracking-wide">Role Name</span>
            <input
              type="text"
              name="roleName"
              value={roleName}
              required
              placeholder="Enter role name"
              onChange={(e) => {
                setRoleName(e.target.value);
                setErrors("");
              }}
              className={`mt-1 input input-bordered lg:input-md w-full ${
                errors ? "input-error" : ""
              }`}
            />
          </label>
          {errors && <p className="mt-1 text-error text-xs">{errors}</p>}
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-base-content">Permissions</h3>
          
          {modules
            .filter((m) => m.module_parent_id === 0)
            .map((parent) => {
              const parentView = parent.permissions.find(
                (p) => p.permission_code === "view"
              );
              const childModules = modules.filter(
                (m) => m.module_parent_id === parent.module_id
              );

              return (
                <div
                  key={parent.module_id}
                  className="bg-base-100 border border-base-300 rounded-lg overflow-hidden"
                >
                  <div className="flex items-center gap-3 px-4 py-3 bg-base-200/50">
                    <CustomCheckbox
                      checked={parentView?.is_allowed === 1}
                      onChange={handleAccessConfig}
                      name={parent.module_code}
                      value="view"
                    />
                    <span className="font-semibold text-base-content">{parent.module_name}</span>
                  </div>

                  <div className="py-2">
                    {parent.permissions
                      .filter((p) => p.permission_code !== "view")
                      .length > 0 && (
                      <div className="space-y-1 px-4">
                        {parent.permissions
                          .filter((p) => p.permission_code !== "view")
                          .map((p) => (
                            <div
                              key={p.permission_id}
                              className="flex items-center gap-3 py-2 pl-8 hover:bg-base-200/30 rounded transition-colors"
                            >
                              <CustomCheckbox
                                checked={p.is_allowed === 1}
                                onChange={handleAccessConfig}
                                name={parent.module_code}
                                value={p.permission_code}
                              />
                              <span className="text-sm text-base-content">{p.permission_name}</span>
                            </div>
                          ))}
                      </div>
                    )}

                    {childModules.length > 0 && (
                      <div className="mt-2 mx-4 border-l-2 border-base-300">
                        {childModules.map((child) => {
                          const childView = child.permissions.find(
                            (p) => p.permission_code === "view"
                          );

                          return (
                            <div key={child.module_id} className="ml-4">
                              <div className="flex items-center gap-3 py-2 bg-base-200/20 px-3 rounded-t">
                                <CustomCheckbox
                                  checked={childView?.is_allowed === 1}
                                  onChange={handleAccessConfig}
                                  name={child.module_code}
                                  value="view"
                                />
                                <span className="text-sm font-medium text-base-content">{child.module_name}</span>
                              </div>

                              {child.permissions.filter((p) => p.permission_code !== "view").length > 0 && (
                                <div className="space-y-1 pb-2">
                                  {child.permissions
                                    .filter((p) => p.permission_code !== "view")
                                    .map((p) => (
                                      <div
                                        key={p.permission_id}
                                        className="flex items-center gap-3 py-1.5 pl-10 hover:bg-base-200/20 rounded transition-colors"
                                      >
                                        <CustomCheckbox
                                          checked={p.is_allowed === 1}
                                          onChange={handleAccessConfig}
                                          name={child.module_code}
                                          value={p.permission_code}
                                        />
                                        <span className="text-xs text-base-content">{p.permission_name}</span>
                                      </div>
                                    ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-base-200">
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => {
              setRoleName(editItem.name);
              setErrors("");
              fetchAllModules();
              onBack?.();
            }}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary btn-sm">
            Update Role
          </button>
        </div>
      </form>
    </div>
  );
};

export default RoleEditPage;
