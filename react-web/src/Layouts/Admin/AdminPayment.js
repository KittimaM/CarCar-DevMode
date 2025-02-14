import React, { useEffect, useState } from "react";
import { GetAllBooking } from "../Api";


// icon remix
import 'remixicon/fonts/remixicon.css';

const AdminPayment = () => {
  const [paidList, setPaidList] = useState([]);
  useEffect(() => {
    GetAllBooking('WHERE processing_status = "Paid"').then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        setPaidList(msg);
      } else {
        console.log(data);
      }
    });
  }, []);
  return (
    <>
      <div className="bg-[#e9e9e9] ml-[250px] h-screen overflow-y-auto">
          <div className="container mx-auto bg-white p-3 mt-36">
              <div>
                  <h1 className="flex justify-start items-center text-4xl font-bold py-10 pl-10 border-b-2 border-[#e5e5e5]">Payment History | ประวัติการชําระเงิน </h1>
              </div>

              {/* header search */}
              <div className="py-6 space-y-5">
                  <form className="flex justify-start items-center space-x-5 px-5 ">

                      {/* date */}
                    
                      <div className="flex flex-col w-full max-w-[320px] ">
                          <label className="">
                              <span className="label-text">วันที่</span>                  
                          </label>
                          <input type="date" name="start_date" className="border-2 border-[#e9e9e9] rounded-md p-3" />                           

                      </div>

                      {/* type */}

                      <div className="flex flex-col w-full max-w-[320px] ">
                          <label className="">
                              <span className="label-text ">ประเภท</span>                  
                          </label>
                          <select className="border-2 border-[#e9e9e9] rounded-md p-3">    
                              <option value="" selected>ทั้งหมด</option>              
                              <option>รอชำระ</option>
                              <option>รอเริ่มงาน</option>
                              <option>กำลังทำงาน</option>
                              <option>เสร็จสิ้น</option>
                          </select>
                      </div>

                      {/*ปุ่ม search ค้นหา */}
                      <div className="flex w-full max-w-[150px] mt-5 ">
                          <button type="submit" className="btn bg-[#4672DD] text-white text-xl hover:text-black w-full max-w-[120px] rounded-md">ค้นหา</button>
                      </div>

                  </form>

                  
                   <div className="flex justify-between items-center px-5 "> 
                    {/* auto search ค้นหา */}
                      <form className="">
                        <div className="flex justify-start items-center space-x-2 ">
                            <div className="">
                                <label className="w-full justify-center items-center p-3">
                                    <span className="label-text text-xl">Search:</span>                  
                                </label>                                    
                            </div>
                            <input type="text" name="search" className="border-2 border-[#d3d3d3] rounded-md p-3 w-[275px]"/> 
                        </div>
                    </form>

                    
                    {/* export */}
                    <button  className="btn tooltip bg-[#4692DD] rounded-md text-white hover:text-black" data-tip="Export">                  
                      <i class="ri-export-line text-2xl font-thin "></i>
                    </button>


                   </div>
                   
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
                  <td>service_price</td>
                </tr>
              </thead>
              <tbody>
                {paidList &&
                  paidList.map((item) => (
                    <tr key={item.id}   className="hover:bg-[#f1f1f1] text-[#1c1c1c]" >
                      <td>{item.id}</td>
                      <td>{item.car_no}</td>
                      <td>{item.start_service_datetime.split("T")[0]}</td>
                      <td>{item.start_service_datetime.split("T")[1]}</td>
                      <td>{item.service_price}</td>
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

export default AdminPayment;
