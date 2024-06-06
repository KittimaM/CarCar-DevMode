import React, { useEffect, useState } from "react";
import {
  GetAllAdminCustomer,
  GetAllAdminCustomerCar,
  GetAllCarSize,
  DeleteAdminCustomerCar,
  GetAllProvince,
  PostAddAdminCustomerCar,
  UpdateAdminCustomerCar,
} from "../../Api";
import URLList from "../../Url/URLList";

const AdminCustomerCar = ({ permission }) => {
  const [customerList, setCustomerList] = useState();
  const [customerCarList, setCustomerCarList] = useState();
  const [carSizeList, setCarSizeList] = useState();
  const [openAddCustomerCarForm, setOpenAddCustomerCarForm] = useState(false);
  const [provinceList, setProvinceList] = useState();
  const [editItem, setEditItem] = useState(null);
  const [errors, setErrors] = useState([]);

  const fetchCustomerCar = () => {
    GetAllAdminCustomerCar(URLList.AdminCustomerCarURL).then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        setCustomerCarList(msg);
      } else if (status == "NO DATA") {
        setCustomerCarList(null);
      } else {
        console.log(data);
      }
    });
  };
  useEffect(() => {
    fetchCustomerCar();
    GetAllAdminCustomer(URLList.AdminCustomerURL).then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        setCustomerList(msg);
      } else {
        console.log(data);
      }
    });
    GetAllCarSize(URLList.AdminCarSizeURL).then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        setCarSizeList(msg);
      } else {
        console.log(data);
      }
    });
    GetAllProvince(URLList.ProvinceURL).then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        setProvinceList(msg);
      } else {
        console.log(data);
      }
    });
  }, []);

  const handleAddCustomerCar = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const validatedErrors = validateData(data);
    const { status, msg } = validatedErrors;
    if (status == "ERROR") {
      return setErrors(msg);
    } else {
      const jsonData = {
        plate_no: data.get("plate_no"),
        prefix: msg.prefix,
        postfix: msg.postfix,
        province: data.get("province"),
        brand: data.get("brand"),
        model: data.get("model"),
        color: data.get("color"),
        size_id: data.get("size_id"),
        customer_id: data.get("customer_id"),
      };
      PostAddAdminCustomerCar(URLList.AdminCustomerCarURL, jsonData).then(
        (data) => {
          const { status, msg } = data;
          if (status == "SUCCESS") {
            setErrors([]);
            setOpenAddCustomerCarForm(false);
            fetchCustomerCar();
          } else {
            console.log(data);
          }
        }
      );
    }
  };

  const handleSelectEditId = (selectedItem) => {
    setEditItem(selectedItem);
  };

  const validateData = (data) => {
    let errorMsg = {};
    const prefix = data.get("plate_no").match(/\d+\D+|\D+/g);
    const postfix = data.get("plate_no").match(/(\d+)$/g);

    if (
      (prefix == null || prefix == "") &&
      (postfix == null || postfix == "")
    ) {
      errorMsg["plate_no"] = "please insert data";
    } else if (
      prefix == null ||
      prefix == "" ||
      postfix == null ||
      postfix == ""
    ) {
      errorMsg["plate_no"] = "wrong structure plate no";
    }

    if (data.get("brand") == null || data.get("brand") == "") {
      errorMsg["brand"] = "please insert data";
    }
    if (data.get("model") == null || data.get("model") == "") {
      errorMsg["model"] = "please insert data";
    }
    if (data.get("color") == null || data.get("color") == "") {
      errorMsg["color"] = "please insert data";
    }

    if (Object.entries(errorMsg).length !== 0) {
      return { status: "ERROR", msg: errorMsg };
    } else {
      return {
        status: "SUCCESS",
        msg: { prefix: prefix[0], postfix: postfix[0] },
      };
    }
  };

  const handleEditCustomerCar = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const validatedErrors = validateData(data);
    const { status, msg } = validatedErrors;
    if (status == "ERROR") {
      return setErrors(msg);
    } else {
      const jsonData = {
        id: editItem.id,
        plate_no: data.get("plate_no"),
        prefix: msg.prefix,
        postfix: msg.postfix,
        province: data.get("province"),
        brand: data.get("brand"),
        model: data.get("model"),
        color: data.get("color"),
        size_id: data.get("size_id"),
        customer_id: data.get("customer_id"),
      };
      UpdateAdminCustomerCar(URLList.AdminCustomerCarURL, jsonData).then(
        (data) => {
          const { status, msg } = data;
          if (status == "SUCCESS") {
            setErrors([]);
            setEditItem(null);
            fetchCustomerCar();
          } else {
            console.log(data);
          }
        }
      );
    }
  };

  const handleDeleteCustomerCar = (event) => {
    event.preventDefault();
    const jsonData = {
      id: event.target.value,
    };
    DeleteAdminCustomerCar(URLList.AdminCustomerCarURL, jsonData).then(
      (data) => {
        const { status, msg } = data;
        if (status == "SUCCESS") {
          fetchCustomerCar();
        } else {
          console.log(data);
        }
      }
    );
  };
  return (
    <div>
      {permission && permission.includes("2") && (
        <button className="btn" onClick={() => setOpenAddCustomerCarForm(true)}>
          Add Customer's Car
        </button>
      )}
      <table className="table table-lg">
        <thead>
          <tr>
            <td>plate_no</td>
            <td>customer's name</td>
            <td>province</td>
            <td>brand</td>
            <td>model</td>
            <td>size</td>
            <td>color</td>
            {permission && permission.includes("3") && <td>Edit</td>}
            {permission && permission.includes("4") && <td>Delete</td>}
          </tr>
        </thead>
        <tbody>
          {customerCarList &&
            customerCarList.map((customerCar) => (
              <tr key={customerCar.id}>
                <td>{customerCar.plate_no}</td>
                <td>
                  {customerList &&
                    customerList.map(
                      (customer) =>
                        customer.id == customerCar.customer_id && customer.name
                    )}
                </td>
                <td>{customerCar.province}</td>
                <td>{customerCar.brand}</td>
                <td>{customerCar.model}</td>
                <td>
                  {carSizeList &&
                    carSizeList.map(
                      (carSize) =>
                        carSize.id == customerCar.size_id && carSize.size
                    )}
                </td>
                <td>{customerCar.color}</td>
                {permission && permission.includes("3") && (
                  <td>
                    <button
                      className="btn"
                      value={customerCar.id}
                      onClick={() => handleSelectEditId(customerCar)}
                    >
                      Edit
                    </button>
                  </td>
                )}
                {permission && permission.includes("4") && (
                  <td>
                    <button
                      className="btn"
                      value={customerCar.id}
                      onClick={handleDeleteCustomerCar}
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
        </tbody>
      </table>
      {openAddCustomerCarForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-2xl mb-4">Add Customer's Car</h2>
            <form onSubmit={handleAddCustomerCar}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  plate_no
                </label>
                <input
                  type="text"
                  name="plate_no"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {errors.plate_no && (
                  <p className="mt-1 text-red-500 text-sm">{errors.plate_no}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  province
                </label>
                {provinceList && (
                  <select
                    name="province"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    {provinceList.map((province) => (
                      <option value={province.province} key={province.id}>
                        {province.province}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  brand
                </label>
                <input
                  type="text"
                  name="brand"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {errors.brand && (
                  <p className="mt-1 text-red-500 text-sm">{errors.brand}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  model
                </label>
                <input
                  type="text"
                  name="model"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {errors.model && (
                  <p className="mt-1 text-red-500 text-sm">{errors.model}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  color
                </label>
                <input
                  type="text"
                  name="color"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {errors.color && (
                  <p className="mt-1 text-red-500 text-sm">{errors.color}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  car size
                </label>
                {carSizeList && (
                  <select
                    name="size_id"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    {carSizeList.map(
                      (carSize) =>
                        carSize.is_available == 1 && (
                          <option value={carSize.id} key={carSize.id}>
                            {carSize.size}
                          </option>
                        )
                    )}
                  </select>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  customer'name
                </label>
                {customerList && (
                  <select
                    name="customer_id"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    {customerList.map((customer) => (
                      <option value={customer.id} key={customer.id}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                )}
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
                  onClick={() => {
                    setErrors([]);
                    setOpenAddCustomerCarForm(false);
                  }}
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
            <h2 className="text-2xl mb-4">Edit Customer's Car</h2>
            <form onSubmit={handleEditCustomerCar}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  plate_no
                </label>
                <input
                  defaultValue={editItem.plate_no}
                  type="text"
                  name="plate_no"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {errors.plate_no && (
                  <p className="mt-1 text-red-500 text-sm">{errors.plate_no}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  province
                </label>
                {provinceList && (
                  <select
                    defaultValue={editItem.province}
                    name="province"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    {provinceList.map((province) => (
                      <option value={province.province} key={province.id}>
                        {province.province}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  brand
                </label>
                <input
                  defaultValue={editItem.brand}
                  type="text"
                  name="brand"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {errors.brand && (
                  <p className="mt-1 text-red-500 text-sm">{errors.brand}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  model
                </label>
                <input
                  defaultValue={editItem.model}
                  type="text"
                  name="model"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {errors.model && (
                  <p className="mt-1 text-red-500 text-sm">{errors.model}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  color
                </label>
                <input
                  defaultValue={editItem.color}
                  type="text"
                  name="color"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {errors.color && (
                  <p className="mt-1 text-red-500 text-sm">{errors.color}</p>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  car size
                </label>
                {carSizeList && (
                  <select
                    defaultValue={editItem.size_id}
                    name="size_id"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    {carSizeList.map(
                      (carSize) =>
                        carSize.is_available == 1 && (
                          <option value={carSize.id} key={carSize.id}>
                            {carSize.size}
                          </option>
                        )
                    )}
                  </select>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  customer'name
                </label>
                {customerList && (
                  <select
                    defaultValue={editItem.customer_id}
                    name="customer_id"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    {customerList.map((customer) => (
                      <option value={customer.id} key={customer.id}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                )}
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
                  onClick={() => {
                    setErrors([]);
                    setEditItem(null);
                  }}
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

export default AdminCustomerCar;
