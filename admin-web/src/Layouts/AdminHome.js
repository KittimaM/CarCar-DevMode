import React, { useEffect, useState } from "react";
import { GetChannel } from "./Api";

const AdminHome = () => {
  const [channel, setChannel] = useState();
  useEffect(() => {
    GetChannel().then((data) => {
      const { status, msg } = data;
      if (status === "SUCCESS") {
        setChannel(msg);
      } else {
        console.log(data);
      }
    });
  }, []);

  const [activeTab, setActiveTab] = useState("1");

  return (
    <div>home</div>
    // <div className="flex flex-col bg-[#ffffff] p-5 rounded-lg shadow-lg h-full overflow-y-auto">
    //   <div className="container mx-auto justify-center items-center">
    //     {/* --------stat-------- */}
    //     <div className="w-full mt-10 tabs tabs-lifted  stats stats-vertical lg:stats-horizontal shadow bg-yellow-100 shadow-mda">
    //       <div className="stat bg-red-200">
    //         <div className="stat-title">Now</div>
    //         <div className="stat-value">A015</div>
    //         <div className="stat-desc">Queue Number</div>
    //       </div>

    //       <div className="stat">
    //         <div className="stat-title">Waiting</div>
    //         <div className="stat-value">4</div>
    //         <div className="stat-desc">Queue</div>
    //       </div>

    //       <div className="stat bg-green-200">
    //         <div className="stat-title">Total amount</div>
    //         <div className="stat-value">31K</div>
    //         <div className="stat-desc">Jan 1st </div>
    //       </div>
    //     </div>

    //     {/* ------- tab------- */}
    //     <div className="mt-10">
    //       {/* Tabs Navigation */}
    //       <div role="tablist" className="tabs tabs-boxed">
    //         {channel &&
    //           channel.map(
    //             (item) =>
    //               item.is_available === 1 && (
    //                 <button
    //                   key={item.id}
    //                   className={`tab transition-all duration-300 ${
    //                     activeTab === item.id
    //                       ? "tab-active bg-primary text-white"
    //                       : ""
    //                   } hover:bg-primary hover:text-white`}
    //                   onClick={() => setActiveTab(item.id)}
    //                 >
    //                   {item.name}
    //                 </button>
    //               ),
    //           )}
    //       </div>

    //       {/* Fixed tab Content Area */}
    //       <div className="bg-base-200 border-base-300 rounded-box p-6 overflow-x-auto">
    //         {channel &&
    //           channel.map(
    //             (item) =>
    //               item.is_available === 1 &&
    //               activeTab === item.id && (
    //                 <div key={item.id}>
    //                   <h2 className="text-lg font-bold">
    //                     Waiting (Queue) {item.name}
    //                   </h2>

    //                   {/* Table */}
    //                   <table className="table mt-4 ">
    //                     <thead>
    //                       <tr>
    //                         <th>Queue Number</th>
    //                         <th>Name</th>
    //                         <th>Phone</th>
    //                         <th>Time</th>
    //                         <th>Car Number</th>
    //                         <th>Size</th>
    //                         <th>Status</th>
    //                         <th></th>
    //                         <th>Edit</th>
    //                         <th>Delete</th>
    //                       </tr>
    //                     </thead>
    //                     <tbody>
    //                       <tr>
    //                         <td>
    //                           <div className="font-bold">A016</div>
    //                         </td>
    //                         <td>Daniel</td>
    //                         <td>0898765432</td>
    //                         <td>14.00 pm</td>
    //                         <td>6กด5310</td>
    //                         <td>M</td>
    //                         <td>Waiting</td>
    //                         <td>
    //                           <button className="btn bg-green-300 btn-md">
    //                             Start
    //                           </button>
    //                         </td>
    //                         <td>
    //                           <button className="btn bg-blue-300 btn-md">
    //                             Edit
    //                           </button>
    //                         </td>
    //                         <td>
    //                           <button className="btn bg-red-300 btn-md">
    //                             Delete
    //                           </button>
    //                         </td>
    //                       </tr>
    //                     </tbody>
    //                   </table>
    //                 </div>
    //               ),
    //           )}
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default AdminHome;
