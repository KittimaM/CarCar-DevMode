import React, { useEffect, useState } from "react";
import { differenceInDays, parseISO } from "date-fns";
import {
  GetOnLeavePersonal,
  DeleteOnLeave,
  PostAddOnLeavePersonal,
  GetAllOnLeaveType,
  AdminGetLatestOnLeaveByType,
} from "../Api";

const AdminOnLeavePersonal = ({ data }) => {
  const { labelValue, permission } = data;
  const [onLeaveList, setOnLeaveList] = useState([]);
  const [onLeaveTypeList, setOnLeaveTypeList] = useState([]);
  const [openAddForm, setOpenAddForm] = useState(false);
  const [errors, setErrors] = useState([]);
  const [selectedLeaveType, setSelectedLeaveType] = useState(null);
  const [minEndDate, setMinEndDate] = useState(null);
  const [maxEndDate, setMaxEndDate] = useState(null);

  const fetchOnLeaveList = () => {
    GetOnLeavePersonal().then((data) => {
      const { status, msg } = data;
      if (status === "SUCCESS") {
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
    fetchOnLeaveList();
    GetAllOnLeaveType().then((data) => {
      const { status, msg } = data;
      if (status === "SUCCESS") {
        const selectedLeaveType = msg.find((item) => item.is_available === 1);
        if (selectedLeaveType) {
          setSelectedLeaveType(selectedLeaveType);
        }
        setOnLeaveTypeList(msg);
      } else {
        console.log(data);
      }
    });
  }, []);

  const validateData = (data) => {
    let errorMsg = {};
    if (data.get("start_date") === null || data.get("start_date") === "") {
      errorMsg["start_date"] = "please insert data";
    }
    if (data.get("end_date") === null || data.get("end_date") === "") {
      errorMsg["end_date"] = "please insert data";
    }
    if (data.get("reason") === null || data.get("reason") === "") {
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
    const { value } = event.target;
    const { id, day_limit } = selectedLeaveType;
    setMinEndDate(value);
    const initialDate = new Date(value);
    const maxDate = new Date(initialDate);
    AdminGetLatestOnLeaveByType(id).then((latestOnLeave) => {
      const { status, msg } = latestOnLeave;
      if (status === "SUCCESS") {
        maxDate.setDate(maxDate.getDate() + (msg.remain_days - 1));
        setMaxEndDate(maxDate.toISOString().split("T")[0]);
      } else if (status === "NO DATA") {
        maxDate.setDate(maxDate.getDate() + (day_limit - 1));
        setMaxEndDate(maxDate.toISOString().split("T")[0]);
      } else {
        console.log(latestOnLeave);
      }
    });
  };

  const handleSelectedOnLeaveType = (event) => {
    const { value } = event.target;
    const selectedLeaveType = onLeaveTypeList.find(
      (onLeaveType) => onLeaveType.id === value,
    );
    if (selectedLeaveType) {
      setSelectedLeaveType(selectedLeaveType);
    }
  };

  const handleAddOnLeave = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const validatedErrors = validateData(data);
    const { status, msg } = validatedErrors;
    if (status === "ERROR") {
      setErrors(msg);
    } else {
      const jsonData = {
        on_leave_type_id: data.get("on_leave_type_id"),
        start_date: data.get("start_date"),
        end_date: data.get("end_date"),
        reason: data.get("reason"),
      };
      AdminGetLatestOnLeaveByType(jsonData.on_leave_type_id).then(
        (latestOnLeave) => {
          const startDate = parseISO(data.get("start_date"));
          const endDate = parseISO(data.get("end_date"));
          jsonData["number_of_days"] = differenceInDays(endDate, startDate) + 1;
          if (
            latestOnLeave.status === "SUCCESS" ||
            latestOnLeave.status === "NO DATA"
          ) {
            if (latestOnLeave.status === "SUCCESS") {
              const latestOnLeaveData = latestOnLeave.msg;
              jsonData["remain_days"] =
                latestOnLeaveData["remain_days"] - jsonData.number_of_days;
            } else if (latestOnLeave.status === "NO DATA") {
              jsonData["remain_days"] =
                selectedLeaveType.day_limit - jsonData.number_of_days;
            }
            PostAddOnLeavePersonal(jsonData).then((data) => {
              const { status, msg } = data;
              if (status === "SUCCESS") {
                fetchOnLeaveList();
              } else {
                console.log(data);
              }
            });
          } else {
            console.log(latestOnLeave);
          }
        },
      );
    }
  };

  const handleDeleteOnLeave = (event) => {
    event.preventDefault();
    const jsonData = {
      id: event.target.value,
    };
    DeleteOnLeave(jsonData).then((data) => {
      const { status, msg } = data;
      if (status === "SUCCESS") {
        fetchOnLeaveList();
      } else {
        console.log(data);
      }
    });
  };
  return (
    <>
      <div className="flex flex-col bg-[#ffffff] mx-auto p-5 rounded-lg shadow-lg h-full overflow-y-auto">
        <div className="flex justify-start items-center text-4xl font-bold py-10 pl-10 border-b-2 border-[#e5e5e5]">
          {labelValue}
        </div>
        {permission["add"] === 1 && (
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
              <td>number of days</td>
              <td>reason</td>
              <td>status</td>
              {permission["delete"] === 1 && <td>Delete</td>}
            </tr>
          </thead>
          <tbody>
            {onLeaveList &&
              onLeaveList.map((onLeave) => (
                <tr key={onLeave.id}>
                  <td>{String(onLeave.start_date).split("T")[0]}</td>
                  <td>{String(onLeave.end_date).split("T")[0]}</td>
                  <td>
                    {onLeaveTypeList &&
                      onLeaveTypeList.map(
                        (leaveType) =>
                          leaveType.id === onLeave.on_leave_type_id &&
                          leaveType.type,
                      )}
                  </td>
                  <td>{onLeave.number_of_days}</td>
                  <td>{onLeave.reason}</td>
                  <td>{onLeave.is_approved === 1 ? "Approved" : "Pending"}</td>
                  {permission["delete"] === 1 && (
                    <td>
                      <button
                        className="btn"
                        onClick={handleDeleteOnLeave}
                        value={onLeave.id}
                        disabled={onLeave.is_approved === 1}
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
                    onChange={handleSelectedOnLeaveType}
                    name="on_leave_type_id"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    {onLeaveTypeList &&
                      onLeaveTypeList.map(
                        (onLeaveType) =>
                          onLeaveType.is_available === 1 && (
                            <option key={onLeaveType.id} value={onLeaveType.id}>
                              {onLeaveType.type}
                            </option>
                          ),
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

export default AdminOnLeavePersonal;
