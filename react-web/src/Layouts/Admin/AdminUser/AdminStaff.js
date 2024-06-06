import React, { useEffect, useState } from "react";
import {
  DeleteStaffUser,
  GetAllStaff,
  GetAllRole,
  UpdateStaffUser,
  PostAddStaffUser,
} from "../../Api";
import URLList from "../../Url/URLList";

const AdminStaff = ({ permission }) => {
  const [user, setUser] = useState(null);
  const [allRole, setAllRole] = useState();
  const [editItem, setEditItem] = useState(null);
  const [openAddUserForm, setOpenAddUserForm] = useState(false);

  useEffect(() => {
    fetchStaff();
    GetAllRole().then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        setAllRole(msg);
      } else {
        console.log(data);
      }
    });
  }, []);

  const fetchStaff = () => {
    GetAllStaff(URLList.AdminStaff).then((data) => {
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
    PostAddStaffUser(URLList.AdminStaff, jsonData).then((data) => {
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
    DeleteStaffUser(URLList.AdminStaff, jsonData).then((data) => {
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
    UpdateStaffUser(URLList.AdminStaff, jsonData).then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        fetchStaff();
        setEditItem(null);
      } else {
        console.log(data);
      }
    });
  };

  return (
    <div>
      {permission && permission.includes("2") && (
        <button className="btn" onClick={() => setOpenAddUserForm(true)}>
          Add Staff
        </button>
      )}

      {user && (
        <table className="table table-lg">
          <thead>
            <tr>
              <td>username</td>
              <td>name</td>
              {permission && permission.includes("3") && <td>Edit</td>}
              {permission && permission.includes("4") && <td>Delete</td>}
            </tr>
          </thead>
          <tbody>
            {user.map((item) => (
              <tr key={item.id}>
                <td>{item.username}</td>
                <td>{item.name}</td>
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
  );
};

export default AdminStaff;
