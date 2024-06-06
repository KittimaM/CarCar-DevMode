import React, { useEffect, useState } from "react";
import {
  ApproveOnLeave,
  DeleteOnLeave,
  GetAllOnLeave,
  GetAllStaff,
  PostAddOnLeave,
  UpdateOnLeave,
  GetAllOnLeaveType,
} from "../Api";
import URLList from "../Url/URLList";

const AdminOnLeave = ({permission}) => {
  const [staff, setStaff] = useState([]);
  const [onLeaveList, setOnLeaveList] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [onLeaveType, setOnLeaveType] = useState([]);

  const fetchOnLeaveList = () => {
    GetAllOnLeave().then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        setOnLeaveList(msg);
      } else {
        console.log(data);
      }
    });
  };

  useEffect(() => {
    GetAllStaff(URLList.AdminStaff).then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        setStaff(msg);
      } else {
        console.log(data);
      }
    });
    fetchOnLeaveList();
    GetAllOnLeaveType(URLList.AdminOnLeaveType).then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        setOnLeaveType(msg);
      } else {
        console.log(data);
      }
    });
  }, []);

  const handleAddOnLeave = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const jsonData = {
      staff_id: data.get("staff_id"),
      start_date: data.get("start_date"),
      end_date: data.get("end_date"),
      reason: data.get("reason"),
      on_leave_type_id: data.get("on_leave_type_id"),
    };
    PostAddOnLeave(jsonData).then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        fetchOnLeaveList();
      } else {
        console.log(data);
      }
    });
  };

  const handleSelectEditId = (selectedItem) => {
    setEditItem(selectedItem);
  };

  const handleEditOnLeave = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const jsonData = {
      id: editItem.id,
      staff_id: data.get("staff_id"),
      on_leave_type_id: data.get("on_leave_type_id"),
      start_date:
        data.get("start_date").length == 0
          ? editItem.start_date.split("T")[0]
          : data.get("start_date"),
      end_date:
        data.get("end_date").length == 0
          ? editItem.end_date.split("T")[0]
          : data.get("end_date"),
      reason: data.get("reason"),
    };

    UpdateOnLeave(jsonData).then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        setEditItem(null);
        fetchOnLeaveList();
      } else {
        console.log(data);
      }
    });
  };

  const handleDeleteOnLeave = (event) => {
    event.preventDefault();
    const jsonData = {
      id: event.target.value,
    };
    DeleteOnLeave(jsonData).then((data) => {
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
    const [id, on_leave_type_id] = value.split(",");
    const jsonData = {
      id: id,
      on_leave_type_id: on_leave_type_id,
    };
    ApproveOnLeave(jsonData).then((data) => {
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

        {staff && permission && permission.includes("2") && (
          <form onSubmit={handleAddOnLeave}>
            <label>Staff</label>
            <select name="staff_id">
              {staff.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <label>type</label>
            <select name="on_leave_type_id">
              {onLeaveType.map((item) => (
                <option value={item.id}>{item.type}</option>
              ))}
            </select>
            <lable>Start Date</lable>
            <input type="date" name="start_date" />
            <lable>End Date</lable>
            <input type="date" name="end_date" />
            <label>Reason</label>
            <input type="text" name="reason" />
            <button className="btn" type="submit">
              Submit OnLeave
            </button>
          </form>
        )}
        {onLeaveList && (
          <table className="table table-lg">
            <thead>
              <tr>
                <td>staff_id</td>
                <td>start_date</td>
                <td>end_date</td>
                <td>on_leave_type</td>
                <td>reason</td>
                <td>status</td>
                {permission && permission.includes("3") && <td>Edit</td>}
                {permission && permission.includes("4") && <td>Delete</td>}
                {permission && permission.includes("5") && <td>Approve</td>}
              </tr>
            </thead>
            <tbody>
              {onLeaveList.map((item) => (
                <tr>
                  <td>{item.staff_id}</td>
                  <td>{String(item.start_date).split("T")[0]}</td>
                  <td>{String(item.end_date).split("T")[0]}</td>
                  <td>
                    {onLeaveType &&
                      onLeaveType.map(
                        (leaveType) =>
                          leaveType.id == item.on_leave_type_id &&
                          leaveType.type
                      )}
                  </td>
                  <td>{item.reason}</td>
                  <td>{item.is_approved == 1 ? "Approved" : "Pending"}</td>
                  {permission && permission.includes("3") && (
                    <td>
                      <button
                        className="btn"
                        onClick={() => handleSelectEditId(item)}
                        value={item.id}
                        disabled={item.is_approved == 1}
                      >
                        Edit
                      </button>
                    </td>
                  )}
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
                  {permission && permission.includes("5") && (
                    <td>
                      <button
                        className="btn"
                        onClick={handleApprovedOnLeave}
                        value={[item.id, item.on_leave_type_id]}
                        disabled={item.is_approved == 1}
                      >
                        {item.is_approved == 1
                          ? "Approved"
                          : "Click to approve"}
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {permission && permission.includes("3") && editItem && (
          <form onSubmit={handleEditOnLeave}>
            <label>Staff</label>
            <select name="staff_id" defaultValue={editItem.staff_id}>
              {staff.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <label>type</label>
            <select
              name="on_leave_type_id"
              defaultValue={editItem.on_leave_type_id}
            >
              {onLeaveType.map((item) => (
                <option value={item.id}>{item.type}</option>
              ))}
            </select>
            <lable>Start Date</lable>
            <input
              type="date"
              name="start_date"
              defaultValue={editItem.start_date}
            />
            <lable>End Date</lable>
            <input
              type="date"
              name="end_date"
              defaultValue={editItem.end_date}
            />
            <label>Reason</label>
            <input type="text" name="reason" defaultValue={editItem.reason} />
            <button className="btn" type="submit">
              Submit Edit
            </button>
          </form>
        )}
      </div>
    </>
  );
};

export default AdminOnLeave;
