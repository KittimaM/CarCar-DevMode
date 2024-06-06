import React, { useEffect, useState } from "react";
import {
  DeleteCarSize,
  GetAllCarSize,
  PostAddCarSize,
  UpdateCarSize,
  GetPermission,
} from "../Api";
import URLList from "../Url/URLList";
import Notification from "../Notification/Notification";

const AdminCarSize = ({ permission }) => {
  const [carSizeList, setCarSizeList] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [openAddCarSizeForm, setOpenAddCarSizeForm] = useState(false);
  const [errors, setErrors] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState();
  const [notificationStatus, setNotificationStatus] = useState();

  const handleShowNotification = () => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
      setNotificationMessage(null);
    }, 3000);
  };

  const fetchCarSize = async () => {
    GetAllCarSize(URLList.AdminCarSizeURL).then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        setCarSizeList(msg);
      } else if (status == "NO DATA") {
        setCarSizeList(null);
      } else {
        console.log(data);
      }
      setErrors([]);
    });
  };

  useEffect(() => {
    fetchCarSize();
  }, []);

  const validateData = (data) => {
    let errorMsg = {};
    if (data.get("size") == null || data.get("size") == "") {
      errorMsg["size"] = "please insert data";
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

  const handleSubmitAddCarSize = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const validatedErrors = validateData(data);
    const { status, msg } = validatedErrors;
    if (status == "ERROR") {
      setErrors(msg);
    } else {
      const jsonData = {
        size: data.get("size"),
        description: data.get("description"),
        is_available: data.get("is_available") !== null ? 1 : 0,
      };
      PostAddCarSize(URLList.AdminCarSizeURL, jsonData).then((data) => {
        const { status, msg } = data;
        if (status == "SUCCESS") {
          setNotificationMessage(`success add carsize = ${jsonData.size}`);
          setNotificationStatus(status);
          handleShowNotification();
          setOpenAddCarSizeForm(false);
          fetchCarSize();
        } else if (status == "ERROR") {
          let errorMsg = {};
          if (msg.code == "ER_DUP_ENTRY") {
            errorMsg["size"] = "duplicated";
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

  const handleDeleteUser = (event) => {
    event.preventDefault();
    const jsonData = {
      id: event.target.value,
    };
    DeleteCarSize(URLList.AdminCarSizeURL, jsonData).then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        setNotificationMessage("success delete");
        setNotificationStatus(status);
        handleShowNotification();
        fetchCarSize();
      } else {
        if (msg.code == "ER_ROW_IS_REFERENCED_2") {
          setNotificationMessage("in use");
          setNotificationStatus(status);
          handleShowNotification();
        } else {
          console.log(data);
        }
      }
    });
  };

  const handleEditCarSize = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const validatedErrors = validateData(data);
    const { status, msg } = validatedErrors;
    if (status == "ERROR") {
      setErrors(msg);
    } else {
      const jsonData = {
        id: editItem.id,
        size: data.get("size"),
        description: data.get("description"),
        is_available: data.get("is_available") !== null ? 1 : 0,
      };
      UpdateCarSize(URLList.AdminCarSizeURL, jsonData).then((data) => {
        const { status, msg } = data;
        if (status == "SUCCESS") {
          setNotificationMessage(`success edit carsize = ${jsonData.size}`);
          setNotificationStatus(status);
          handleShowNotification();
          setEditItem(null);
          fetchCarSize();
        } else if (status == "ERROR") {
          let errorMsg = {};
          if (msg.code == "ER_DUP_ENTRY") {
            errorMsg["size"] = "duplicated";
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

  return (
    <>
      <div className="ml-80 mt-16">
        <div className="text-lg bg-yellow-100 mb-5 "> Car size page</div>
        {showNotification && (
          <Notification
            message={notificationMessage}
            type={notificationStatus}
          />
        )}
        {permission && permission.includes("2") && (
          <button
            className="btn"
            onClick={() => {
              setOpenAddCarSizeForm(true);
            }}
          >
            Add Car Size
          </button>
        )}

        <table className="table table-lg">
          <thead>
            <tr>
              <td>size</td>
              <td>description</td>
              <td>is_available</td>
              {permission && permission.includes("3") && <td>Edit</td>}
              {permission && permission.includes("4") && <td>Delete</td>}
            </tr>
          </thead>
          <tbody>
            {carSizeList &&
              carSizeList.map((carSize) => (
                <tr key={carSize.id}>
                  <td>{carSize.size}</td>
                  <td>{carSize.description}</td>
                  <td>
                    {carSize.is_available == 1 ? "available" : "not available"}
                  </td>
                  {permission && permission.includes("3") && (
                    <td>
                      <button
                        className="btn"
                        onClick={() => handleSelectEditId(carSize)}
                        value={carSize.id}
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
                        value={carSize.id}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
        {openAddCarSizeForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h2 className="text-2xl mb-4">Add Car Size</h2>
              <form onSubmit={handleSubmitAddCarSize}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Size
                  </label>
                  <input
                    type="text"
                    name="size"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                  {errors.size && (
                    <p className="mt-1 text-red-500 text-sm">{errors.size}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    name="description"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
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
                      setOpenAddCarSizeForm(false);
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
              <h2 className="text-2xl mb-4">Edit Car Size</h2>
              <form onSubmit={handleEditCarSize}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Size
                  </label>
                  <input
                    defaultValue={editItem.size}
                    type="text"
                    name="size"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                  {errors.size && (
                    <p className="mt-1 text-red-500 text-sm">{errors.size}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Description
                  </label>
                  <input
                    defaultValue={editItem.description}
                    type="text"
                    name="description"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
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
    </>
  );
};

export default AdminCarSize;
