import React, { useEffect, useState } from "react";
import {
  DeleteStaffUser,
  GetAllStaff,
  GetAllAdminRole,
  UpdateStaffUser,
  PostAddStaffUser,
  UpdateAdminActiveStaff,
  UpdateAdminUnlockStaff,
} from "../../Api";

const AdminStaff = ({ data }) => {
  const { labelValue, permission } = data;
  const [user, setUser] = useState(null);
  const [allRole, setAllRole] = useState();
  const [editItem, setEditItem] = useState(null);
  const [openAddUserForm, setOpenAddUserForm] = useState(false);

  useEffect(() => {
    fetchStaff();
    GetAllAdminRole().then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        setAllRole(msg);
      } else {
        console.log(data);
      }
    });
  }, []);

  const fetchStaff = () => {
    GetAllStaff().then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        setUser(msg);
      } else {
        console.log(data);
      }
    });
  };

  const handleAddUser = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const jsonData = {
      name: data.get("name"),
      username: data.get("username"),
      password: data.get("password"),
      role_id: data.get("role_id"),
    };
    PostAddStaffUser(jsonData).then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        setOpenAddUserForm(false);
        fetchStaff();
      } else {
        console.log(data);
      }
    });
  };
  const handleDeleteUser = (event) => {
    event.preventDefault();
    const jsonData = {
      id: event.target.value,
    };
    DeleteStaffUser(jsonData).then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        fetchStaff();
      } else {
        console.log(data);
      }
    });
  };

  const handleSelectEditId = (selectedItem) => {
    setEditItem(selectedItem);
  };

  const handleEditUser = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const jsonData = {
      id: editItem.id,
      name: data.get("name"),
      username: data.get("username"),
      password: data.get("password"),
      role_id: data.get("role_id"),
    };
    UpdateStaffUser(jsonData).then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        fetchStaff();
        setEditItem(null);
      } else {
        console.log(data);
      }
    });
  };

  const handleActiveUser = (event) => {
    event.preventDefault();
    const jsonData = {
      id: event.target.value,
    };
    UpdateAdminActiveStaff(jsonData).then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        fetchStaff();
      } else {
        console.log(data);
      }
    });
  };

  const handleUnlockUser = (event) => {
    event.preventDefault();
    const jsonData = {
      id: event.target.value,
    };
    UpdateAdminUnlockStaff(jsonData).then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        fetchStaff();
      } else {
        console.log(data);
      }
    });
  };

  return (
    <div>
      <div className="flex flex-col bg-[#ffffff] mx-auto p-5 rounded-lg shadow-xl h-full overflow-y-auto">
        <div>
          <h1 className="flex justify-start items-center text-4xl font-bold py-10 pl-10 border-b-2 border-[#e5e5e5]">{labelValue}</h1>
        </div>
      {permission && permission['add'] == 1 && (
        <button className="btn" onClick={() => setOpenAddUserForm(true)}>
          Add Staff
        </button>
      )}

      {user && (
        <table className="table table-lg">
          <thead>
            <tr>
              <td>is active</td>
              <td>is locked</td>
              <td>locked reason</td>
              <td>username</td>
              <td>name</td>
              {permission && permission['edit'] == 1 && <td>Edit</td>}
              {permission && permission['delete'] == 1 && <td>Delete</td>}
            </tr>
          </thead>
          <tbody>
            {user.map((item) => (
              <tr key={item.id}>
                <td>
                  {item.is_active == 1 ? (
                    "-"
                  ) : (
                    <button
                      className="btn"
                      value={item.id}
                      onClick={handleActiveUser}
                    >
                      inactive
                    </button>
                  )}
                </td>
                <td>
                  {item.is_locked == 1 ? (
                    <button
                      className="btn"
                      value={item.id}
                      onClick={handleUnlockUser}
                    >
                      Locked
                    </button>
                  ) : (
                    "-"
                  )}
                </td>
                <td>{item.locked_reason ? item.locked_reason : "-"}</td>
                <td>{item.username}</td>
                <td>{item.name}</td>
                {permission && permission['edit'] == 1 && (
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
                {permission && permission['delete'] == 1 && (
                  <td>
                    <button
                      className="btn"
                      onClick={handleDeleteUser}
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
      {openAddUserForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-2xl mb-4">New Staff</h2>
            <form onSubmit={handleAddUser}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  username
                </label>
                <input
                  type="text"
                  name="username"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  name
                </label>
                <input
                  type="text"
                  name="name"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  password
                </label>
                <input
                  type="password"
                  name="password"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  role
                </label>
                <select
                  name="role_id"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  {allRole.map((item) => (
                    <option value={item.id} key={item.id}>
                      {item.role}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => setOpenAddUserForm(false)}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {editItem && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-2xl mb-4">Edit Staff</h2>
            <form onSubmit={handleEditUser}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  username
                </label>
                <input
                  defaultValue={editItem.username}
                  type="text"
                  name="username"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  name
                </label>
                <input
                  defaultValue={editItem.name}
                  type="text"
                  name="name"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  password
                </label>
                <input
                  type="password"
                  name="password"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  role
                </label>
                {
                  <select
                    defaultValue={editItem.role_id}
                    name="role_id"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    {allRole.map((item) => (
                      <option value={item.id} key={item.id}>
                        {item.role}
                      </option>
                    ))}
                  </select>
                }
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="ml-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => setEditItem(null)}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default AdminStaff;
