import React, { useEffect, useState } from "react";
import { differenceInDays, parseISO } from "date-fns";
import {
  ApproveOnLeave,
  DeleteOnLeave,
  GetAllOnLeave,
  GetAllStaff,
  PostAddOnLeave,
  GetAllOnLeaveType,
  AdminGetLatestOnLeaveByType,
} from "../Api";
import URLList from "../Url/URLList";

const AdminOnLeave = ({ permission }) => {
  const [staffList, setStaffList] = useState([]);
  const [onLeaveList, setOnLeaveList] = useState([]);
  const [onLeaveTypeList, setOnLeaveTypeList] = useState([]);
  const [openAddForm, setOpenAddForm] = useState(false);
  const [errors, setErrors] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedLeaveType, setSelectedLeaveType] = useState(null);
  const [minEndDate, setMinEndDate] = useState(null);
  const [maxEndDate, setMaxEndDate] = useState(null);

  const fetchOnLeaveList = () => {
    GetAllOnLeave(URLList.AdminOnLeave).then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        setOnLeaveList(msg);
      } else {
        console.log(data);
      }
      setMinEndDate(null);
      setMaxEndDate(null);
      setOpenAddForm(false);
      setErrors([]);
    });
  };

  useEffect(() => {
    GetAllStaff(URLList.AdminStaff).then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        setSelectedStaff(msg[0]);
        setStaffList(msg);
      } else {
        console.log(data);
      }
    });
    fetchOnLeaveList();
    GetAllOnLeaveType(URLList.AdminOnLeaveType).then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        const selectedLeaveType = msg.find((item) => item.is_available == 1);
        if (selectedLeaveType) {
          setSelectedLeaveType(selectedLeaveType);
        }
        setOnLeaveTypeList(msg);
      } else {
        console.log(data);
      }
    });
  }, []);

  const handleSelectedStartDate = (event) => {
    const { value } = event.target;
    setMinEndDate(value);
    const initialDate = new Date(value);
    const maxDate = new Date(initialDate);
    const jsonData = {
      staff_id: selectedStaff.id,
      on_leave_type_id: selectedLeaveType.id,
    };
    AdminGetLatestOnLeaveByType(
      URLList.AdminLatestOnLeaveByTypeList,
      jsonData
    ).then((latestOnLeave) => {
      const { status, msg } = latestOnLeave;
      if (status == "SUCCESS") {
        maxDate.setDate(maxDate.getDate() + (msg.remain_days - 1));
        setMaxEndDate(maxDate.toISOString().split("T")[0]);
      } else if (status == "NO DATA") {
        maxDate.setDate(maxDate.getDate() + (selectedLeaveType.day_limit - 1));
        setMaxEndDate(maxDate.toISOString().split("T")[0]);
      } else {
        console.log(latestOnLeave);
      }
    });
  };

  const handleSelectedOnLeaveType = (event) => {
    const { value } = event.target;
    const selectedLeaveType = onLeaveTypeList.find(
      (onLeaveType) => onLeaveType.id == value
    );
    if (selectedLeaveType) {
      setSelectedLeaveType(selectedLeaveType);
    }
  };

  const handleSelectedStaff = (event) => {
    const { value } = event.target;
    const selectedStaff = staffList.find((staff) => staff.id == value);
    if (selectedStaff) {
      setSelectedStaff(selectedStaff);
    }
  };

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

  const handleAddOnLeave = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const validatedErrors = validateData(data);
    const { status, msg } = validatedErrors;
    if (status == "ERROR") {
      setErrors(msg);
    } else {
      const jsonData = {
        staff_id: data.get("staff_id"),
        start_date: data.get("start_date"),
        end_date: data.get("end_date"),
        reason: data.get("reason"),
        on_leave_type_id: data.get("on_leave_type_id"),
      };
      AdminGetLatestOnLeaveByType(URLList.AdminLatestOnLeaveByTypeList, {
        staff_id: jsonData.staff_id,
        on_leave_type_id: jsonData.on_leave_type_id,
      }).then((latestOnLeave) => {
        const startDate = parseISO(data.get("start_date"));
        const endDate = parseISO(data.get("end_date"));
        jsonData["number_of_days"] = differenceInDays(endDate, startDate) + 1;
        if (
          latestOnLeave.status == "SUCCESS" ||
          latestOnLeave.status == "NO DATA"
        ) {
          if (latestOnLeave.status == "SUCCESS") {
            const latestOnLeaveData = latestOnLeave.msg;
            jsonData["remain_days"] =
              latestOnLeaveData["remain_days"] - jsonData.number_of_days;
          } else if (latestOnLeave.status == "NO DATA") {
            jsonData["remain_days"] =
              selectedLeaveType.day_limit - jsonData.number_of_days;
          }
          PostAddOnLeave(URLList.AdminOnLeave, jsonData).then((data) => {
            const { status, msg } = data;
            if (status == "SUCCESS") {
              fetchOnLeaveList();
            } else {
              console.log(data);
            }
          });
        } else {
          console.log(latestOnLeave);
        }
      });
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

  const handleApprovedOnLeave = (event) => {
    event.preventDefault();
    const { value } = event.target;
    const jsonData = {
      id: value,
    };
    ApproveOnLeave(URLList.AdminOnLeaveApprove, jsonData).then((data) => {
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
        <div className="text-lg bg-yellow-100 mb-5 ">On Leave List</div>
        {permission.includes("2") && (
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
              <td>staff_id</td>
              <td>start_date</td>
              <td>end_date</td>
              <td>on_leave_type</td>
              <td>number of days</td>
              <td>reason</td>
              <td>status</td>
              {permission.includes("4") && <td>Delete</td>}
              {permission.includes("5") && <td>Approve</td>}
            </tr>
          </thead>
          <tbody>
            {onLeaveList &&
              onLeaveList.map((onLeave) => (
                <tr>
                  <td>{staffList.find(staff => staff.id == onLeave.staff_id).username}</td>
                  <td>{String(onLeave.start_date).split("T")[0]}</td>
                  <td>{String(onLeave.end_date).split("T")[0]}</td>
                  <td>
                    {onLeaveTypeList &&
                      onLeaveTypeList.map(
                        (onLeaveType) =>
                          onLeaveType.id == onLeave.on_leave_type_id &&
                          onLeaveType.type
                      )}
                  </td>
                  <td>{onLeave.number_of_days}</td>
                  <td>{onLeave.reason}</td>
                  <td>{onLeave.is_approved == 1 ? "Approved" : "Pending"}</td>
                  {permission.includes("4") && (
                    <td>
                      <button
                        className="btn"
                        onClick={handleDeleteOnLeave}
                        value={onLeave.id}
                        disabled={onLeave.is_approved == 1}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                  {permission.includes("5") && (
                    <td>
                      <button
                        className="btn"
                        onClick={handleApprovedOnLeave}
                        value={onLeave.id}
                        disabled={onLeave.is_approved == 1}
                      >
                        {onLeave.is_approved == 1
                          ? "Approved"
                          : "Click to approve"}
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
                    staff
                  </label>
                  <select
                    onChange={handleSelectedStaff}
                    name="staff_id"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    {staffList &&
                      staffList.map((staff) => (
                        <option key={staff.id} value={staff.id}>
                          {staff.username}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Type
                  </label>
                  <select
                    onChange={handleSelectedOnLeaveType}
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
                  <input
                    name="end_date"
                    type="date"
                    min={minEndDate}
                    max={maxEndDate}
                  />
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

export default AdminOnLeave;
