import React, { useState, useEffect } from "react";
import {
  DeleteStatus,
  GetAllStatus,
  GetAllStatusGroup,
  PostAddStatus,
  UpdateStatus,
} from "../Api";

const AdminStatus = ({ data }) => {
  const { labelValue, permission } = data;
  const [statusGroups, setStatusGroups] = useState();
  const [statuses, setStatuses] = useState();
  const [editItem, setEditItem] = useState(null);
  const [openAddForm, setOpenAddForm] = useState(false);

  const fetchAllStatus = () => {
    GetAllStatusGroup().then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        setStatusGroups(msg);
      } else {
        console.log(data);
      }
    });
    GetAllStatus().then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        setStatuses(msg);
      } else {
        console.log(data);
      }
    });
  };
  useEffect(() => {
    fetchAllStatus();
  }, []);

  const handleAddStatus = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const jsonData = {
      code: data.get("code"),
      description: data.get("description"),
      status_group_id: data.get("status_group_id"),
    };
    PostAddStatus(jsonData).then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        fetchAllStatus();
      } else {
        console.log(data);
      }
    });
  };

  const handleSelectEditId = (selectedItem) => {
    setEditItem(selectedItem);
  };

  const handleEditStatus = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const jsonData = {
      id: editItem.id,
      code: data.get("code"),
      description: data.get("description"),
      status_group_id: data.get("status_group_id"),
    };
    UpdateStatus(jsonData).then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        setEditItem(null);
        fetchAllStatus();
      } else {
        console.log(data);
      }
    });
  };

  const handleDeleteStatus = (event) => {
    event.preventDefault();
    const jsonData = {
      id: event.target.value,
    };
    DeleteStatus(jsonData).then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        fetchAllStatus();
      } else {
        console.log(data);
      }
    });
  };

  return (
    <div>
      <div className="flex flex-col bg-[#ffffff] mx-auto p-5 rounded-lg shadow-xl h-full overflow-y-auto">
        <div className="flex justify-start items-center text-4xl font-bold py-10 pl-10 border-b-2 border-[#e5e5e5]">
          {labelValue}
        </div>

        <div className="flex justify-end items-center">
          {permission && permission["add"] == 1 && (
            <button
              className="btn bg-[#181d2a] text-white max-w-sm "
              onClick={() => setOpenAddForm(true)}
            >
              Add Status
            </button>
          )}
        </div>
        {statusGroups &&
          statusGroups.map((statusGroup) => (
            <div>
              {statusGroup.code} - {statusGroup.description}
              <table className="table table-lg">
                <thead>
                  <tr>
                    <td>code</td>
                    <td>description</td>
                    {permission && permission["edit"] == 1 && <td>Edit</td>}
                    {permission && permission["delete"] == 1 && <td>Delete</td>}
                  </tr>
                </thead>
                <tbody>
                  {statuses &&
                    statuses.map(
                      (status) =>
                        status.status_group_id == statusGroup.id && (
                          <tr>
                            <td>{status.code}</td>
                            <td>{status.description}</td>
                            {permission && permission["edit"] == 1 && (
                              <td>
                                <button
                                  className="btn"
                                  onClick={() => handleSelectEditId(status)}
                                  value={status.id}
                                >
                                  Edit
                                </button>
                              </td>
                            )}
                            {permission && permission["delete"] == 1 && (
                              <td>
                                <button
                                  className="btn"
                                  onClick={handleDeleteStatus}
                                  value={status.id}
                                >
                                  Delete
                                </button>
                              </td>
                            )}
                          </tr>
                        )
                    )}
                </tbody>
              </table>
            </div>
          ))}
        {openAddForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h2 className="text-2xl mb-4">New Status</h2>
              <form onSubmit={handleAddStatus}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Code
                  </label>
                  <input
                    type="text"
                    name="code"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    description
                  </label>
                  <input
                    type="text"
                    name="description"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    status group
                  </label>
                  <select
                    name="status_group_id"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    {statusGroups.map((statusGroup) => (
                      <option value={statusGroup.id} key={statusGroup.id}>
                        {statusGroup.code}
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
                    onClick={() => setOpenAddForm(false)}
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
              <h2 className="text-2xl mb-4">Edit Status</h2>
              <form onSubmit={handleEditStatus}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Code
                  </label>
                  <input
                    defaultValue={editItem.code}
                    type="text"
                    name="code"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    description
                  </label>
                  <input
                    defaultValue={editItem.description}
                    type="text"
                    name="description"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    status group
                  </label>
                  <select
                    defaultValue={editItem.status_group_id}
                    name="status_group_id"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    {statusGroups.map((statusGroup) => (
                      <option value={statusGroup.id} key={statusGroup.id}>
                        {statusGroup.code}
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

export default AdminStatus;
