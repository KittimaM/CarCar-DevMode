import React, { useEffect, useState } from "react";
import {
  GetAllBooking,
  PostAddAccount,
  PostUpDateBookingStatus,
} from "../Api";


const AdminSchedule = ({permission}) => {
  const [todaySchedule, setTodaySchedule] = useState([]);

  useEffect(() => {
    GetAllBooking().then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        setTodaySchedule(msg);
      } else {
        console.log(data);
      }
    });
  }, []);

  const handleUpdateStatus = (event) => {
    event.preventDefault();
    const { value } = event.target;
    const [booking_id, car_no, service_price, processing_status] =
      value.split(",");
    let status = "";
    switch (processing_status) {
      case "Waiting":
        status = "Service in process";
        break;

      case "Service in process":
        status = "Finish Service";
        break;

      case "Finish Service":
        status = "Paid";
        break;

      case "Paid":
        status = "Done";
        break;
      case "Cancel":
        status = "Cancel";
        break;
    }

    const jsonData = {
      processing_status: status,
      booking_id: booking_id,
    };
    PostUpDateBookingStatus(jsonData).then((updatedResponse) => {
      if (updatedResponse.status == "SUCCESS") {
        GetAllBooking().then((data) => {
          const { status, msg } = data;
          if (status == "SUCCESS") {
            setTodaySchedule(msg);
          } else {
            console.log(data);
          }
        });
      } else {
        console.log(updatedResponse);
      }
    });

    if (status == "Paid") {
      const today = new Date();
      const year = today.getFullYear();
      const month = (today.getMonth() + 1).toString().padStart(2, "0");
      const day = today.getDate().toString().padStart(2, "0");
      const jsonData = {
        label: car_no,
        is_income: 1,
        income: service_price,
        is_expense: 0,
        expense: 0,
        date: `${year}-${month}-${day}`,
      };
      PostAddAccount(jsonData).then((data) => console.log(data));
    }
  };

  return (
    <>

    <div className="ml-80 mt-16">

      <div className="text-lg bg-yellow-100 mb-5 "> Schedule page</div>

      <table className="table table-lg">
        <thead>
          <tr>
            <td>id</td>
            <td>car_no</td>
            <td>date</td>
            <td>time</td>
            <td>status</td>
            <td></td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {todaySchedule &&
            todaySchedule.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.car_no}</td>
                <td>{item.start_service_datetime.split("T")[0]}</td>
                <td>{item.start_service_datetime.split("T")[1]}</td>
                <td>{item.processing_status}</td>
                <td>
                  {item.processing_status == "Waiting" && (
                    <button
                      className="btn"
                      onClick={handleUpdateStatus}
                      value={[
                        item.id,
                        item.car_no,
                        item.service_price,
                        item.processing_status,
                      ]}
                    >
                      Start Service
                    </button>
                  )}
                  {item.processing_status == "Service in process" && (
                    <button
                      className="btn"
                      onClick={handleUpdateStatus}
                      value={[
                        item.id,
                        item.car_no,
                        item.service_price,
                        item.processing_status,
                      ]}
                    >
                      Finish Service
                    </button>
                  )}
                  {item.processing_status == "Finish Service" && (
                    <button
                      className="btn"
                      onClick={handleUpdateStatus}
                      value={[
                        item.id,
                        item.car_no,
                        item.service_price,
                        item.processing_status,
                      ]}
                    >
                      Pay
                    </button>
                  )}
                  {item.processing_status == "Paid" && <p>Done</p>}
                  {permission &&
                    permission.includes("4") &&
                    item.processing_status == "Cancel" && <p>Cancel</p>}
                </td>
                {item.processing_status == "Waiting" && (
                  <td>
                    <button
                      className="btn"
                      onClick={handleUpdateStatus}
                      value={[item.id, "Cancel"]}
                    >
                      Cancel
                    </button>
                  </td>
                )}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
    </>
    
  );
};

export default AdminSchedule;
