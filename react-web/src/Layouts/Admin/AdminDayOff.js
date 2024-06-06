import React, { useEffect, useState } from "react";
import { GetAllDayOff, GetAllStaff, UpdateDayOff } from "../Api";
import { getDatesForCurrentWeek } from "../Module";
import URLList from "../Url/URLList";

const AdminDayOff = ({ permisison }) => {
  const [staff, setStaff] = useState([]);
  const [dayOffList, setDayOffList] = useState([]);
  const [editItem, setEditItem] = useState();
  const [dayCount, setDayCount] = useState(null);
  const [dates, setDates] = useState([]);

  const fetchDayOff = () => {
    GetAllDayOff().then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        setDayOffList(msg);
        let dataToInsert = {
          Sunday: 0,
          Monday: 0,
          Tuesday: 0,
          Wednesday: 0,
          Thursday: 0,
          Friday: 0,
          Saturday: 0,
        };
        msg.map((item) => {
          dataToInsert[item.day_off] += 1;
        });
        setDayCount(dataToInsert);
      } else {
        console.log(data);
      }
    });
  };

  useEffect(() => {
    fetchDayOff();
    GetAllStaff(URLList.AdminStaff).then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        setStaff(msg);
      } else {
        console.log(data);
      }
    });

    const weekDates = getDatesForCurrentWeek();
    setDates(weekDates);
  }, []);

  const handleSelectEditId = (selectedItem) => {
    setEditItem(selectedItem);
  };

  const handleEditDayOff = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const jsonData = {
      staff_id: editItem.staff_id,
      day_off: data.get("day_off"),
    };
    UpdateDayOff(jsonData).then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        setEditItem(null);
        setDayCount(null);
        fetchDayOff();
      } else {
        console.log(data);
      }
    });
  };

  return (
    <>
      <div className="ml-80 mt-16">
        <div className="text-lg bg-yellow-100 mb-5 "> Day off page</div>

        {dayOffList && (
          <table>
            <thead>
              <tr>
                {dates && dates.map((date, index) => (
                  <td key={index}>{date}</td>
                ))}
              </tr>
            </thead>
            <tbody>
              {dayOffList.map((item) =>
                staff.map((staff_item) => (
                  <tr>
                    <td>
                      {staff_item.id == item.staff_id &&
                        item.day_off == "Sunday" && (
                          <button
                            className="btn"
                            onClick={() => handleSelectEditId(item)}
                          >
                            {staff_item.username}
                          </button>
                        )}
                    </td>
                    <td>
                      {staff_item.id == item.staff_id &&
                        item.day_off == "Monday" && (
                          <button
                            className="btn"
                            onClick={() => handleSelectEditId(item)}
                          >
                            {staff_item.username}
                          </button>
                        )}
                    </td>
                    <td>
                      {staff_item.id == item.staff_id &&
                        item.day_off == "Tuesday" && (
                          <button
                            className="btn"
                            onClick={() => handleSelectEditId(item)}
                          >
                            {staff_item.username}
                          </button>
                        )}
                    </td>
                    <td>
                      {staff_item.id == item.staff_id &&
                        item.day_off == "Wednesday" && (
                          <button
                            className="btn"
                            onClick={() => handleSelectEditId(item)}
                          >
                            {staff_item.username}
                          </button>
                        )}
                    </td>
                    <td>
                      {staff_item.id == item.staff_id &&
                        item.day_off == "Thursday" && (
                          <button
                            className="btn"
                            onClick={() => handleSelectEditId(item)}
                          >
                            {staff_item.username}
                          </button>
                        )}
                    </td>
                    <td>
                      {staff_item.id == item.staff_id &&
                        item.day_off == "Friday" && (
                          <button
                            className="btn"
                            onClick={() => handleSelectEditId(item)}
                          >
                            {staff_item.username}
                          </button>
                        )}
                    </td>
                    <td>
                      {staff_item.id == item.staff_id &&
                        item.day_off == "Saturday" && (
                          <button
                            className="btn"
                            onClick={() => handleSelectEditId(item)}
                          >
                            {staff_item.username}
                          </button>
                        )}
                    </td>
                  </tr>
                ))
              )}
              {dayCount && (
                <tr>
                  <td>Sunday : {dayCount["Sunday"]}</td>
                  <td>Monday : {dayCount["Monday"]}</td>
                  <td>Tuesday : {dayCount["Tuesday"]}</td>
                  <td>Wednesday : {dayCount["Wednesday"]}</td>
                  <td>Thursday : {dayCount["Thursday"]}</td>
                  <td>Friday : {dayCount["Friday"]}</td>
                  <td>Saturday : {dayCount["Saturday"]}</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
        {editItem && (
          <form onSubmit={handleEditDayOff}>
            {staff.map(
              (item) =>
                item.id == editItem.staff_id && (
                  <label>
                    username <b>{item.username}</b>
                  </label>
                )
            )}
            <label>Day Off</label>
            <select name="day_off" defaultValue={editItem.day_off}>
              <option value="Sunday">Sunday</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
            </select>
            <button className="btn" type="submit">
              Submit Edit
            </button>
          </form>
        )}
      </div>
    </>
  );
};

export default AdminDayOff;
