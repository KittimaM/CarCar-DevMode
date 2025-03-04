import React, { useEffect, useState } from "react";
import { GetAllBooking, PostAddAccount, PostUpDateBookingStatus } from "../Api";

const AdminSchedule = ({ data }) => {
  const { labelValue, permission } = data;
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
      <div>
        
          <div className="container mx-auto bg-white p-3 mt-36 ">
            <div>
              <h1 className="flex justify-start items-center text-4xl font-bold py-10 pl-10 border-b-2 border-[#e5e5e5]">
                Schedule page | ตารางงาน{" "}
              </h1>
            </div>

            {/* header search */}
            <div className="py-6">
              <form className="flex justify-start items-center space-x-5 px-5 ">
                {/* date */}

                <div className="flex flex-col w-full max-w-[320px] ">
                  <label className="">
                    <span className="label-text">วันที่</span>
                  </label>
                  <input
                    type="date"
                    name="start_date"
                    className="border-2 border-[#e9e9e9] rounded-md p-3"
                  />
                </div>

                {/* type */}

                <div className="flex flex-col w-full max-w-[320px] ">
                  <label className="">
                    <span className="label-text ">ประเภท</span>
                  </label>
                  <select className="border-2 border-[#e9e9e9] rounded-md p-3">
                    <option value="" selected>
                      ทั้งหมด
                    </option>
                    <option>รอชำระ</option>
                    <option>รอเริ่มงาน</option>
                    <option>กำลังทำงาน</option>
                    <option>เสร็จสิ้น</option>
                  </select>
                </div>

                {/*ปุ่ม search ค้นหา */}
                <div className="flex w-full max-w-[150px] mt-5 ">
                  <button
                    type="submit"
                    className="btn bg-[#4672DD] rounded-md text-white text-xl hover:text-black w-full max-w-[120px]"
                  >
                    ค้นหา
                  </button>
                </div>
              </form>

              {/* auto search ค้นหา */}
              <form className="">
                <div className="flex justify-start items-center space-x-2 py-5 px-5">
                  <div className="">
                    <label className="w-full justify-center items-center p-3">
                      <span className="label-text text-xl">Search:</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    name="search"
                    className="border-2 border-[#d3d3d3] rounded-md p-3 w-[275px]"
                  />
                </div>
              </form>
            </div>

            {/* table */}
            <div className="overflow-x-auto">
              <table className="table text-[#1c1c1c] text-lg">
                <thead className="bg-[#b8b6b6] text-xl text-[#1c1c1c]">
                  <tr>
                    <td>id</td>
                    <td>car_no</td>
                    <td>date</td>
                    <td>time</td>
                    <td>status</td>
                    <td></td>
                  </tr>
                </thead>
                <tbody>
                  {todaySchedule &&
                    todaySchedule.map((item) => (
                      <tr
                        className="hover:bg-[#f1f1f1] text-[#1c1c1c]"
                        key={item.id}
                      >
                        <td>{item.id}</td>
                        <td>{item.car_no}</td>
                        <td>{item.start_service_datetime.split("T")[0]}</td>
                        <td>{item.start_service_datetime.split("T")[1]}</td>
                        <td>{item.processing_status}</td>
                        <td>
                          {item.processing_status == "Waiting" && (
                            <button
                              className="btn bg-[#f4ff8c] text-[#1c1c1c] text-xl p-2 rounded-md"
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
                              className="btn bg-[#7287fc] text-[#1c1c1c] text-xl p-2 rounded-md "
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
                              className="btn bg-[#59e454] text-xl p-2 rounded-md"
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
                          {item.processing_status == "Paid" && (
                            <p className="bg-[#7287fc] text-[#1c1c1c] text-xl p-2 rounded-md w-16">
                              Done
                            </p>
                          )}
                          {permission &&
                            permission.includes("4") &&
                            item.processing_status == "Cancel" && (
                              <p className="bg-[#d44646] text-[#1c1c1c] text-xl p-2 rounded-md w-16">
                                Cancel
                              </p>
                            )}
                        </td>
                        {item.processing_status == "Waiting" && (
                          <td>
                            <button
                              className="btn bg-[#d44646] text-[#1c1c1c] text-xl p-2 rounded-md "
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
          </div>
        
      </div>
    </>
  );
};

export default AdminSchedule;
