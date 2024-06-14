import React, { useEffect, useState } from "react";
import {
  GetOnLeavePersonal,
  UpdateOnLeave,
  DeleteOnLeave,
  PostAddOnLeavePersonal,
  GetAllOnLeaveType,
} from "../Api";
import URLList from "../Url/URLList";

const AdminOnLeavePersonal = ({ permission }) => {
  const [onLeaveList, setOnLeaveList] = useState([]);
  const [onLeaveTypeList, setOnLeaveTypeList] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [openAddForm, setOpenAddForm] = useState(false);
  const [errors, setErrors] = useState([]);
  const [startDate, setStartDate] = useState(null);

  const fetchOnLeaveList = () => {
    GetOnLeavePersonal(URLList.AdminOnLeavePersonal).then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        setOnLeaveList(msg);
      } else {
        console.log(data);
      }
      setOpenAddForm(false)
      setErrors([]);
      setEditItem(null);
      setStartDate(null);
    });
  };

  useEffect(() => {
    GetAllOnLeaveType(URLList.AdminOnLeaveType).then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        setOnLeaveTypeList(msg);
      } else {
        console.log(data);
      }
    });
    fetchOnLeaveList();
  }, []);

  const validateData = (data) => {
    let errorMsg = {};
    if (data.get("start_date") == null || data.get("start_date") == "") {
      errorMsg["start_date"] = "please insert data";
    }
    if (data.get("end_date") == null || data.get("end_date") == "") {
      errorMsg["end_date"] = "please insert data";
    }
    if (data.get("reason") == null || data.get("reason") == "") {
      errorMsg["reason"] = "please insert data";
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

  const handleSelectedStartDate = (event) => {
    setStartDate(event.target.value);
  };

  const handleAddOnLeave = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const validatedErrors = validateData(data);
    const { status, msg } = validatedErrors;
    if (status == "ERROR") {
      setErrors(msg);
    } else {
      const jsonData = {
        on_leave_type_id: data.get("on_leave_type_id"),
        start_date: data.get("start_date"),
        end_date: data.get("end_date"),
        reason: data.get("reason"),
      };
      PostAddOnLeavePersonal(URLList.AdminOnLeavePersonal, jsonData).then(
        (data) => {
          const { status, msg } = data;
          if (status == "SUCCESS") {
            fetchOnLeaveList();
          } else {
            console.log(data);
          }
        }
      );
    }
  };

  const handleDeleteOnLeave = (event) => {
    event.preventDefault();
    const jsonData = {
      id: event.target.value,
    };
    DeleteOnLeave(URLList.AdminOnLeave, jsonData).then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        fetchOnLeaveList();
      } else {
        console.log(data);
      }
    });
  };
  return (
    <>
      <div className="ml-80 mt-16">
        <div className="text-lg bg-yellow-100 mb-5 ">On Leave</div>
        {permission && permission.includes("2") && (
          <button
            className="btn"
            onClick={() => {
              setOpenAddForm(true);
            }}
          >
            Add OnLeave
          </button>
        )}
        <table className="table table-lg">
          <thead>
            <tr>
              <td>start_date</td>
              <td>end_date</td>
              <td>on_leave_type</td>
              <td>reason</td>
              <td>status</td>
              {permission && permission.includes("4") && <td>Delete</td>}
            </tr>
          </thead>
          <tbody>
            {onLeaveList &&
              onLeaveList.map((item) => (
                <tr key={item.id}>
                  <td>{String(item.start_date).split("T")[0]}</td>
                  <td>{String(item.end_date).split("T")[0]}</td>
                  <td>
                    {onLeaveTypeList &&
                      onLeaveTypeList.map(
                        (leaveType) =>
                          leaveType.id == item.on_leave_type_id &&
                          leaveType.type
                      )}
                  </td>
                  <td>{item.reason}</td>
                  <td>{item.is_approved == 1 ? "Approved" : "Pending"}</td>
                  {permission && permission.includes("4") && (
                    <td>
                      <button
                        className="btn"
                        onClick={handleDeleteOnLeave}
                        value={item.id}
                        disabled={item.is_approved == 1}
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
              <h2 className="text-2xl mb-4">New OnLeave</h2>
              <form onSubmit={handleAddOnLeave}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Type
                  </label>
                  <select
                    name="on_leave_type_id"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    {onLeaveTypeList &&
                      onLeaveTypeList.map(
                        (onLeaveType) =>
                          onLeaveType.is_available == 1 && (
                            <option key={onLeaveType.id} value={onLeaveType.id}>
                              {onLeaveType.type}
                            </option>
                          )
                      )}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Start Date
                  </label>
                  <input
                    name="start_date"
                    type="date"
                    onChange={handleSelectedStartDate}
                  />
                  {errors.start_date && (
                    <p className="mt-1 text-red-500 text-sm">
                      {errors.start_date}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    End Date
                  </label>
                  <input name="end_date" type="date" min={startDate} />
                  {errors.end_date && (
                    <p className="mt-1 text-red-500 text-sm">
                      {errors.end_date}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Reason
                  </label>
                  <input
                    type="text"
                    name="reason"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                  {errors.reason && (
                    <p className="mt-1 text-red-500 text-sm">{errors.reason}</p>
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
      </div>
    </>
  );
};

export default AdminOnLeavePersonal;
