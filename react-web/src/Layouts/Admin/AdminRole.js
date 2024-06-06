import React, { useEffect, useState } from "react";
import { DeleteRole, GetAllRole, PostAddRole, UpdateRole } from "../Api";

const AdminRole = ({ permission }) => {
  const [role, setRole] = useState();
  const [roleAccess, setRoleAccess] = useState();
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    fetchRole();
  }, []);
  const fetchRole = () => {
    GetAllRole().then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        setRole(msg);
        let defaultAccess = [];
        Object.keys(msg[0]).map((item) => {
          if (item !== "id" && item !== "role") {
            defaultAccess.push({ label: item, access: [0] });
          }
        });
        setRoleAccess(defaultAccess);
      } else {
        console.log(data);
      }
    });
  };
  const handleEnableAccess = (event) => {
    const { checked, name, value } = event.target;
    const [toggleName, accessLevel] = name.split("/");
    setRoleAccess((prev) =>
      prev.map((item) => {
        if (item.label === toggleName) {
          if (checked) {
            if (accessLevel == "view") {
              return {
                label: item.label,
                access: [parseInt(value)],
              };
            } else {
              return {
                label: item.label,
                access: [...item.access, parseInt(value)],
              };
            }
          } else {
            if (accessLevel == "view") {
              return { label: item.label, access: [0] };
            } else {
              return {
                label: item.label,
                access: [...item.access.filter((item) => item != value)],
              };
            }
          }
        } else {
          return item;
        }
      })
    );
  };

  const handleSubmitAddRole = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    let accessData = [];
    roleAccess.map((item) => {
      accessData[item.label] = item.access;
    });
    const jsonData = {
      role: data.get("role"),
      ...accessData,
    };
    PostAddRole(jsonData).then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        fetchRole();
      } else {
        console.log(data);
      }
    });
  };

  const handleSelectEditId = (selectedItem) => {
    setEditItem(selectedItem);
  };

  const handleEditRoleAccess = (event) => {
    const { name, checked, value } = event.target;
    const [toggleName, accessLevel] = name.split("/");
    const updated = Object.keys(editItem).reduce((data, item) => {
      if (item === toggleName) {
        if (checked) {
          if (accessLevel === "view") {
            data[item] = value;
          } else {
            const updateArray = editItem[item].split(",");
            const updateInt = updateArray.map((item) => parseInt(item));
            const updateJoin = [...updateInt, parseInt(value)];
            const finalUpdate = updateJoin.join();
            data[item] = finalUpdate;
          }
        } else {
          if (accessLevel === "view") {
            data[item] = "0";
          } else {
            const updateArray = editItem[item].split(",");
            const updateFilter = updateArray.filter((item) => item != value);
            const updateInt = updateFilter.map((item) => parseInt(item));
            const finalUpdate = updateInt.join();
            data[item] = finalUpdate;
          }
        }
      } else {
        data[item] = editItem[item];
      }
      return data;
    }, {});
    setEditItem(updated);
  };

  const handleEditRole = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const jsonData = {
      id: editItem.id,
      role: data.get("role"),
      ...editItem,
    };
    UpdateRole(jsonData).then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        setEditItem(null);
        fetchRole();
      } else {
        console.log(data);
      }
    });
  };

  const handleDeleteRole = (event) => {
    event.preventDefault();
    const jsonData = {
      id: event.target.value,
    };
    DeleteRole(jsonData).then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        fetchRole();
      } else {
        console.log(data);
      }
    });
  };

  const subRoleEditAccess = (name, value) => {
    if (name == "have_right_to_approve_on_leave") {
      return (
        <div>
          <input
            className="toggle"
            type="checkbox"
            name={name + "/add"}
            value="2"
            defaultChecked={value.includes("2")}
            onChange={handleEditRoleAccess}
          />
          <label>add</label>
          <input
            className="toggle"
            type="checkbox"
            name={name + "/edit"}
            value="3"
            defaultChecked={value.includes("3")}
            onChange={handleEditRoleAccess}
          />
          <label>edit</label>
          <input
            className="toggle"
            type="checkbox"
            name={name + "/delete"}
            value="4"
            defaultChecked={value.includes("4")}
            onChange={handleEditRoleAccess}
          />
          <label>delete</label>
          <input
            className="toggle"
            type="checkbox"
            name={name + "/approve"}
            value="5"
            defaultChecked={value.includes("5")}
            onChange={handleEditRoleAccess}
          />
          <label>approve</label>
        </div>
      );
    } else if (name == "have_booking_access" || name == "have_payment_access") {
      return;
    } else {
      return (
        <div>
          <input
            className="toggle"
            type="checkbox"
            name={name + "/add"}
            value="2"
            defaultChecked={value.includes("2")}
            onChange={handleEditRoleAccess}
          />
          <label>add</label>
          <input
            className="toggle"
            type="checkbox"
            name={name + "/edit"}
            value="3"
            defaultChecked={value.includes("3")}
            onChange={handleEditRoleAccess}
          />
          <label>edit</label>
          <input
            className="toggle"
            type="checkbox"
            name={name + "/delete"}
            value="4"
            defaultChecked={value.includes("4")}
            onChange={handleEditRoleAccess}
          />
          <label>delete</label>
        </div>
      );
    }
  };

  const subRoleAccessContent = (name) => {
    if (name == "have_right_to_approve_on_leave") {
      return (
        <div>
          <input
            className="toggle"
            type="checkbox"
            name={name + "/add"}
            value="2"
            onChange={handleEnableAccess}
          />
          <label>add</label>
          <input
            className="toggle"
            type="checkbox"
            name={name + "/edit"}
            value="3"
            onChange={handleEnableAccess}
          />
          <label>edit</label>
          <input
            className="toggle"
            type="checkbox"
            name={name + "/delete"}
            value="4"
            onChange={handleEnableAccess}
          />
          <label>delete</label>
          <input
            className="toggle"
            type="checkbox"
            name={name + "/approve"}
            value="5"
            onChange={handleEnableAccess}
          />
          <label>approve</label>
        </div>
      );
    } else if (name == "have_booking_access" || name == "have_payment_access") {
      return;
    } else {
      return (
        <div>
          <input
            className="toggle"
            type="checkbox"
            name={name + "/add"}
            value="2"
            onChange={handleEnableAccess}
          />
          <label>add</label>
          <input
            className="toggle"
            type="checkbox"
            name={name + "/edit"}
            value="3"
            onChange={handleEnableAccess}
          />
          <label>edit</label>
          <input
            className="toggle"
            type="checkbox"
            name={name + "/delete"}
            value="4"
            onChange={handleEnableAccess}
          />
          <label>delete</label>
        </div>
      );
    }
  };

  return (
    <>
      <div className="ml-80 mt-16">
        <div className="text-lg bg-yellow-100 mb-5 "> Role page</div>

        {permission && permission.includes("2") && roleAccess && (
          <form onSubmit={handleSubmitAddRole}>
            <label name="role"> role</label>
            <input type="text" name="role" />
            {roleAccess.map((item) => (
              <div>
                <input
                  className="toggle"
                  type="checkbox"
                  value="1"
                  name={item.label + "/view"}
                  onChange={handleEnableAccess}
                />
                <label>{item.label}</label>
                {item.access.includes(1) && subRoleAccessContent(item.label)}
              </div>
            ))}
            <button className="btn" type="submit">
              Submit
            </button>
          </form>
        )}
        {role && (
          <table className="table table-lg">
            <thead>
              <tr>
                <td>id</td>
                <td>role</td>
                {permission && permission.includes("3") && <td>Edit</td>}
                {permission && permission.includes("4") && <td>Delete</td>}
              </tr>
            </thead>
            <tbody>
              {role.map((item) => (
                <tr>
                  <td>{item.id}</td>
                  <td>{item.role}</td>
                  {permission && permission.includes("3") && (
                    <td>
                      <button
                        className="btn"
                        onClick={() => handleSelectEditId(item)}
                        value={item.id}
                      >
                        Edit
                      </button>
                    </td>
                  )}
                  {permission && permission.includes("4") && (
                    <td>
                      <button
                        className="btn"
                        onClick={handleDeleteRole}
                        value={item.id}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {permission && permission.includes("3") && editItem && (
          <form onSubmit={handleEditRole}>
            {Object.keys(editItem).map((item) => (
              <div>
                {item == "role" && (
                  <div>
                    <label>role</label>
                    <input
                      type="text"
                      name="role"
                      defaultValue={editItem[item]}
                    />
                  </div>
                )}
                {item != "role" && item !== "id" && (
                  <div>
                    <input
                      className="toggle"
                      type="checkbox"
                      value="1"
                      name={item + "/view"}
                      onChange={handleEditRoleAccess}
                      defaultChecked={editItem[item].includes("1")}
                    />
                    <label>{item}</label>
                    {!editItem[item].includes("0") &&
                      subRoleEditAccess(item, editItem[item])}
                  </div>
                )}
              </div>
            ))}
            <button className="btn" type="submit">
              Submit Edit
            </button>
          </form>
        )}
      </div>
    </>
  );
};

export default AdminRole;
