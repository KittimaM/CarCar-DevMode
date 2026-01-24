import { useEffect, useState } from "react";
import { GetAllAdminRoleLabel, PostAdminAddRole } from "../../Api";

const AdminAddRole = () => {
  const [modules, setModules] = useState([]);
  const [roleName, setRoleName] = useState("");
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    GetAllAdminRoleLabel().then(({ status, msg }) => {
      if (status === "SUCCESS") {
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

          acc[row.module_id].permissions.push({
            permission_id: row.permission_id,
            permission_code: row.permission_code,
            permission_name: row.permission_name,
            is_allowed: 0,
          });

          return acc;
        }, {});

        setModules(Object.values(grouped));
      }
    });
  }, []);

  const handleAccessConfig = (e) => {
    const { name, value, checked } = e.target;

    setModules((prev) =>
      prev.map((module) => {
        if (module.module_code !== name) return module;

        return {
          ...module,
          permissions: module.permissions.map((p) =>
            p.permission_code === value
              ? { ...p, is_allowed: checked ? 1 : 0 }
              : p,
          ),
        };
      }),
    );
  };

  const handleAddRole = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const allowedAccess = modules.flatMap((module) =>
      module.permissions
        .filter((p) => p.is_allowed == 1)
        .map((p) => ({
          module_id: module.module_id,
          permission_id: p.permission_id,
        })),
    );

    const jsonData = {
      role_name: data.get("role_name"),
      allowedAccess: allowedAccess,
    };
    PostAdminAddRole(jsonData).then(({ status, msg }) => {
      if (status == "ERROR") {
        if (msg.code == "ER_DUP_ENTRY") {
          setErrors("duplicated");
        }
      }
    });
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleAddRole}>
        <div className="border p-4 bg-base-100 space-y-2">
          <div className="flex justify-between items-center font-semibold">
            Role Name
            <input
              type="text"
              name="role_name"
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
                  <>
                    <p className="text-info text-xs">View enabled</p>

                    {parent.permissions
                      .filter((p) => p.permission_code != "view")
                      .map((p) => (
                        <div className="border p-4 bg-base-100 space-y-2">
                          <div
                            key={p.permission_id}
                            className="flex justify-between items-center"
                          >
                            {p.permission_name}
                            <input
                              type="checkbox"
                              className="checkbox checkbox-success"
                              value={p.permission_code}
                              name={parent.module_code}
                              onChange={handleAccessConfig}
                            />
                          </div>
                        </div>
                      ))}
                  </>
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
                                .filter((p) => p.permission_code != "view")
                                .map((p) => (
                                  <div className="border p-4 bg-base-100 space-y-2">
                                    <div
                                      key={p.permission_id}
                                      className="flex justify-between items-center"
                                    >
                                      {p.permission_name}
                                      <input
                                        type="checkbox"
                                        className="checkbox checkbox-success"
                                        value={p.permission_code}
                                        name={child.module_code}
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
        <button type="submit" className="btn btn-success text-white">
          SUBMIT
        </button>
      </form>
    </div>
  );
};

export default AdminAddRole;
