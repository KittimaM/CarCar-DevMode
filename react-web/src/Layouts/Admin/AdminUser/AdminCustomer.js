import React, { useEffect, useState } from "react";
import {
  DeleteAdminCustomer,
  GetAllAdminCustomer,
  PostAdminAddCustomer,
  UpdateAdminCustomer,
} from "../../Api";
import URLList from "../../Url/URLList";

const AdminCustomer = ({ permission }) => {
  const [customer, setCustomer] = useState();
  const [editItem, setEditItem] = useState();
  const [openAddCustomerForm, setOpenAddCustomerForm] = useState(false);
  const fetchCustomer = () => {
    GetAllAdminCustomer(URLList.AdminCustomerURL).then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        setCustomer(msg);
      } else {
        console.log(data);
      }
    });
  };

  useEffect(() => {
    fetchCustomer();
  }, []);

  const handleSelectEditId = (selectedItem) => {
    setEditItem(selectedItem);
  };

  const handleUpdateCustomer = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const jsonData = {
      id: editItem.id,
      phone: data.get("phone"),
      name: data.get("name"),
      password: data.get("password"),
    };
    UpdateAdminCustomer(URLList.AdminCustomerURL, jsonData).then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        fetchCustomer();
        setEditItem(null);
      } else {
        console.log(data);
      }
    });
  };

  const handleAddCustomer = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const jsonData = {
      name: data.get("name"),
      phone: data.get("phone"),
      password: data.get("password"),
    };
    PostAdminAddCustomer(URLList.AdminCustomerURL, jsonData).then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        setOpenAddCustomerForm(false);
        fetchCustomer();
      } else {
        console.log(data);
      }
    });
  };

  const handleDeleteCustomer = (event) => {
    event.preventDefault();
    const jsonData = {
      id: event.target.value,
    };
    DeleteAdminCustomer(URLList.AdminCustomerURL, jsonData).then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        fetchCustomer();
      } else {
        console.log(data);
      }
    });
  };

  return (
    <div>
      {permission && permission.includes("2") && (
        <button className="btn" onClick={() => setOpenAddCustomerForm(true)}>
          Add Customer
        </button>
      )}
      <table className="table table-lg">
        <thead>
          <tr>
            <td>phone</td>
            <td>name</td>
            {permission && permission.includes("3") && <td>Edit</td>}
            {permission && permission.includes("4") && <td>Delete</td>}
          </tr>
        </thead>
        <tbody>
          {customer &&
            customer.map((item) => (
              <tr key={item.id}>
                <td>{item.phone}</td>
                <td>{item.name}</td>
                {permission && permission.includes("3") && (
                  <td>
                    <button
                      className="btn"
                      value={item.id}
                      onClick={() => handleSelectEditId(item)}
                    >
                      Edit
                    </button>
                  </td>
                )}
                {permission && permission.includes("4") && (
                  <td>
                    <button
                      className="btn"
                      value={item.id}
                      onClick={handleDeleteCustomer}
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
        </tbody>
      </table>
      {openAddCustomerForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-2xl mb-4">Add Customer</h2>
            <form onSubmit={handleAddCustomer}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  phone
                </label>
                <input
                  type="text"
                  name="phone"
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
                  onClick={() => setOpenAddCustomerForm(false)}
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
            <h2 className="text-2xl mb-4">Edit Customer</h2>
            <form onSubmit={handleUpdateCustomer}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  phone
                </label>
                <input
                  defaultValue={editItem.phone}
                  type="text"
                  name="phone"
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

export default AdminCustomer;
