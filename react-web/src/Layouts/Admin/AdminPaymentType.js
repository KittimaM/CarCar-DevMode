import React, { useEffect, useState } from "react";
import {
  DeletePaymentType,
  GetAllPaymentType,
  PostAddPaymentType,
  UpdatePaymentType,
} from "../Api";
import Notification from "../Notification/Notification";

const AdminPaymentType = ({ data }) => {
  const { labelValue, permission } = data;
  const [paymentTypeList, setPaymentTypeList] = useState([]);
  const [editItem, setEditItem] = useState();
  const [openAddForm, setOpenAddForm] = useState(false);
  const [errors, setErrors] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState();
  const [notificationStatus, setNotificationStatus] = useState();

  useEffect(() => {
    fetchPaymentType();
  }, []);

  const fetchPaymentType = () => {
    GetAllPaymentType().then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        setPaymentTypeList(msg);
      } else if (status == "NO DATA") {
        setPaymentTypeList(null);
      } else {
        console.log(data);
      }
      setErrors([]);
    });
  };

  const handleShowNotification = () => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
      setNotificationMessage(null);
    }, 3000);
  };

  const validateData = (data) => {
    let errorMsg = {};
    if (data.get("type") == null || data.get("type") == "") {
      errorMsg["type"] = "please insert data";
    }
    if (Object.entries(errorMsg).length !== 0) {
      return { status: "ERROR", msg: errorMsg };
    } else {
      return {
        status: "SUCCESS",
        msg: "",
      };
    }
  };

  const handleAddPaymentType = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const validatedErrors = validateData(data);
    const { status, msg } = validatedErrors;
    if (status == "ERROR") {
      setErrors(msg);
    } else {
      const jsonData = {
        type: data.get("type"),
        is_available: data.get("is_available") !== null ? 1 : 0,
      };
      PostAddPaymentType(jsonData).then((data) => {
        const { status, msg } = data;
        if (status == "SUCCESS") {
          setNotificationMessage(`success add paymenttype = ${jsonData.type}`);
          setNotificationStatus(status);
          handleShowNotification();
          setOpenAddForm(false);
          fetchPaymentType();
        } else if (status == "ERROR") {
          let errorMsg = {};
          if (msg.code == "ER_DUP_ENTRY") {
            errorMsg["type"] = "duplicated";
            setErrors(errorMsg);
          } else {
            console.log(data);
          }
        } else {
          console.log(data);
        }
      });
    }
  };
  const handleSelectEditId = (selectedItem) => {
    setEditItem(selectedItem);
  };
  const handleEditPaymentType = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const jsonData = {
      id: editItem.id,
      type: data.get("type"),
      is_available: data.get("is_available"),
    };
    UpdatePaymentType(jsonData).then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        setNotificationMessage(`success edit paymenttype = ${jsonData.type}`);
        setNotificationStatus(status);
        handleShowNotification();
        setEditItem(null);
        fetchPaymentType();
      } else if (status == "ERROR") {
        let errorMsg = {};
        if (msg.code == "ER_DUP_ENTRY") {
          errorMsg["type"] = "duplicated";
          setErrors(errorMsg);
        } else {
          console.log(data);
        }
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
    DeletePaymentType(jsonData).then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        setNotificationMessage("success deleted");
        setNotificationStatus(status);
        handleShowNotification();
        fetchPaymentType();
      } else {
        console.log(data);
      }
    });
  };

  return (
    <div>
      {showNotification && (
        <Notification message={notificationMessage} type={notificationStatus} />
      )}
      {permission && permission.includes("2") && (
        <button className="btn" onClick={() => setOpenAddForm(true)}>
          Add Payment Type
        </button>
      )}
      <table className="table table-lg">
        <thead>
          <tr>
            <td>type</td>
            <td>is available</td>
            {permission && permission.includes("3") && <td>Edit</td>}
            {permission && permission.includes("4") && <td>Delete</td>}
          </tr>
        </thead>
        <tbody>
          {paymentTypeList &&
            paymentTypeList.map((paymentType) => (
              <tr>
                <td>{paymentType.type}</td>
                <td>
                  {paymentType.is_available == 1
                    ? "available"
                    : "not available"}
                </td>
                {permission && permission.includes("3") && (
                  <td>
                    <button
                      className="btn"
                      onClick={() => handleSelectEditId(paymentType)}
                      value={paymentType.id}
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
                      value={paymentType.id}
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
        </tbody>
      </table>
      {openAddForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-2xl mb-4">Add Payment Type</h2>
            <form onSubmit={handleAddPaymentType}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Payment Type
                </label>
                <input
                  type="text"
                  name="type"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {errors.type && (
                  <p className="mt-1 text-red-500 text-sm">{errors.type}</p>
                )}
              </div>
              <div className="mb-4">
                <input
                  className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-primary dark:checked:after:bg-primary dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
                  type="checkbox"
                  role="switch"
                  name="is_available"
                />
                <label className="inline-block pl-[0.15rem] hover:cursor-pointer">
                  is available
                </label>
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
                    setOpenAddForm(false);
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
            <h2 className="text-2xl mb-4">Edit Payment Type</h2>
            <form onSubmit={handleEditPaymentType}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Payment Type
                </label>
                <input
                  defaultValue={editItem.type}
                  type="text"
                  name="type"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {errors.type && (
                  <p className="mt-1 text-red-500 text-sm">{errors.type}</p>
                )}
              </div>
              <div className="mb-4">
                <input
                  defaultChecked={editItem.is_available == 1}
                  className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-primary dark:checked:after:bg-primary dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
                  type="checkbox"
                  role="switch"
                  name="is_available"
                />
                <label className="inline-block pl-[0.15rem] hover:cursor-pointer">
                  is available
                </label>
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

export default AdminPaymentType;
