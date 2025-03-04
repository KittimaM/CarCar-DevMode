import React, { useEffect, useState } from "react";
import {
  DeleteCarSize,
  GetAllCarSize,
  PostAddCarSize,
  UpdateCarSize,
} from "../Api";
import Notification from "../Notification/Notification";

const AdminCarSize = ({ data }) => {
  const { labelValue, permission } = data;
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
    GetAllCarSize().then((data) => {
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
      PostAddCarSize(jsonData).then((data) => {
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
    DeleteCarSize(jsonData).then((data) => {
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
      UpdateCarSize(jsonData).then((data) => {
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
      <div className="">
        <div className="flex flex-col bg-[#ffffff] mx-auto p-5 rounded-lg shadow-lg h-full overflow-y-auto">
          <div>
            <h1 className="flex justify-start items-center text-4xl font-bold py-10 pl-10 border-b-2 border-[#e5e5e5]">
              Car size | ไซต์รถ{" "}
            </h1>
          </div>

          {showNotification && (
            <Notification
              className="fixed top-0 right-0 justify-between space-x-10"
              message={notificationMessage}
              type={notificationStatus}
            />
          )}

          <div className="flex justify-between items-center ">
            {/* auto search ค้นหา */}
            <form className="">
              <div className="flex justify-start items-center space-x-2 py-5">
                <div className="">
                  <label className="w-full justify-center items-center p-3">
                    <span className="label-text text-xl">Search:</span>
                  </label>
                </div>
                <input
                  type="text"
                  name="search"
                  className="border-1 border-[#d3d3d3] rounded-md p-3 w-[275px]"
                />
              </div>
            </form>

            {permission && permission.includes("2") && (
              <div className="flex justify-center items-center">
                <button
                  className="btn max-w-md  bg-[#748efe] rounded-md  text-white text-xl my-4 hover:text-black items-center "
                  onClick={() => {
                    setOpenAddCarSizeForm(true);
                  }}
                >
                  Add
                </button>
              </div>
            )}
          </div>

            {/* table */}
          <div className="flex-1 overflow-y-auto">
            <table className="table  text-[#1c1c1c] text-lg ">
              <thead className=" text-xl text-[#313E61] shadow-md">
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
                    <tr
                      key={carSize.id}
                      className="hover:bg-[#f1f1f1] text-[#1c1c1c]"
                    >
                      <td>{carSize.size}</td>
                      <td>{carSize.description}</td>
                      <td>
                        {carSize.is_available == 1
                          ? "available"
                          : "not available"}
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
                            className="btn bg-[#ED4306] text-white p-2"
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
          </div>

          {/* add car size form */}
          {openAddCarSizeForm && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-8 rounded-lg shadow-lg w-1/3">
                <h2 className="text-3xl font-semibold mb-8">
                  Add | เพิ่มไซต์รถ{" "}
                </h2>
                <form onSubmit={handleSubmitAddCarSize}>
                  <div className="space-y-2 mb-4">
                    <label className="block text-gray-700 text-lg font-semibold">
                      Size
                    </label>
                    <input
                      type="text"
                      name="size"
                      className="shadow appearance-none border rounded w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline "
                    />
                    {errors.size && (
                      <p className=" text-red-500 text-md">**{errors.size}**</p>
                    )}

                    <label className="block text-gray-700 text-lg font-semibold">
                      Description
                    </label>
                    <input
                      type="text"
                      name="description"
                      className="shadow appearance-none border rounded w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />

                    {/* is_available button */}
                    <div className="flex items-center">
                      <label className="label cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked
                          className="checkbox text-lg"
                        />
                        <span className="label-text mx-3 text-lg">
                          is available
                        </span>
                      </label>
                    </div>

                    {/* <input
                            className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-primary dark:checked:after:bg-primary dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
                            type="checkbox"
                            role="switch"
                            name="is_available"
                          />
                            <label className="inline-block pl-[0.15rem] hover:cursor-pointer">
                              is available
                            </label> */}
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
                      className="ml-4 bg-red-500 hover:bg-red-700 text-white  font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
                <h2 className="text-3xl font-bold mb-4">Edit | แก้ไขไซต์รถ</h2>
                <form onSubmit={handleEditCarSize}>
                  <div className="space-y-2 mb-4">
                    <label className="block text-gray-700 text-lg font-semibold ">
                      Size
                    </label>
                    <input
                      defaultValue={editItem.size}
                      type="text"
                      name="size"
                      className="shadow appearance-none border rounded w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                    {errors.size && (
                      <p className=" text-red-500 text-sm">{errors.size}</p>
                    )}

                    <div className="">
                      <label className="block text-gray-700 text-lg font-semibold">
                        Description
                      </label>
                      <input
                        defaultValue={editItem.description}
                        type="text"
                        name="description"
                        className="shadow appearance-none border rounded w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </div>

                    {/* is_available button */}
                    <div className="flex items-center">
                      <label className="label cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked={editItem.is_available == 1}
                          role="switch"
                          name="is_available"
                          className="checkbox text-lg"
                        />
                        <span className="label-text mx-3 text-lg">
                          is available
                        </span>
                      </label>
                    </div>

                    {/* <div className="mb-4">
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
                          </div> */}
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
      </div>
    </>
  );
};

export default AdminCarSize;
