import React, { useEffect, useState } from "react";
import {
  DeleteCustomerCar,
  GetAllCarSize,
  GetAllProvince,
  GetCustomerCar,
  PostAddCustomerCar,
  UpdateCustomerCar,
  GetCustomerProfile,
} from "../../Modules/Api";

import CustomerAddCar from "./CustomerAddCar";

const CustomerCar = () => {
  const [viewMode, setViewMode] = useState("list");
  const [carSize, setCarSize] = useState(null);
  const [province, setProvince] = useState(null);
  const [editItem, setEditItem] = useState(null);

  // const fetchCustomerCar = async () => {
  //   GetCustomerCar().then((data) => {
  //     const { status, msg } = data;
  //     if (status === "SUCCESS") {
  //       setCar(msg);
  //     } else {
  //       setCar(null);
  //       console.log(data);
  //     }
  //   });
  // };

  // useEffect(() => {
  //   fetchCustomerCar();
  //   GetAllCarSize().then((data) => {
  //     const { status, msg } = data;
  //     if (status === "SUCCESS") {
  //       setCarSize(msg);
  //     } else {
  //       setCarSize(null);
  //       console.log(data);
  //     }
  //   });
  //   GetAllProvince().then((data) => {
  //     const { status, msg } = data;
  //     if (status === "SUCCESS") {
  //       setProvince(msg);
  //     } else {
  //       setProvince(null);
  //       console.log(data);
  //     }
  //   });
  //   GetCustomerProfile().then((data) => {
  //     const { status, msg } = data;
  //     if (status === "SUCCESS") {
  //       setProfile(msg[0]);
  //     } else {
  //       console.log(data);
  //     }
  //   });
  // }, []);

  // const handleCustomerAddCar = (event) => {
  //   event.preventDefault();
  //   const data = new FormData(event.currentTarget);
  //   const prefix = data.get("plate_no").match(/\d+\D+|\D+/g);
  //   const postfix = data.get("plate_no").match(/(\d+)$/g);
  //   const jsonData = {
  //     plate_no: data.get("plate_no"),
  //     prefix: prefix[0],
  //     postfix: postfix[0],
  //     province: data.get("province"),
  //     color: data.get("color"),
  //     size_id: data.get("size").split(",")[0],
  //     size: data.get("size").split(",")[1],
  //     brand: data.get("brand"),
  //     model: data.get("model"),
  //   };

  //   PostAddCustomerCar(jsonData).then((data) => {
  //     const { status, msg } = data;
  //     if (status === "SUCCESS") {
  //       fetchCustomerCar();
  //     } else {
  //       if (msg.code === "ER_DUP_ENTRY") {
  //         alert("this plate no already exist");
  //       } else {
  //         console.log(data);
  //       }
  //     }
  //   });
  // };

  // const handleSelectEditId = (selectedItem) => {
  //   setEditItem(selectedItem);
  // };

  // const handleDeleteCustomerCar = (event) => {
  //   event.preventDefault();
  //   const jsonData = {
  //     id: event.target.value,
  //   };
  //   DeleteCustomerCar(jsonData).then((data) => {
  //     const { status, msg } = data;
  //     if (status === "SUCCESS") {
  //       fetchCustomerCar();
  //     } else {
  //       console.log(data);
  //     }
  //   });
  // };

  // const handleEditCustomerCar = (event) => {
  //   event.preventDefault();
  //   const data = new FormData(event.currentTarget);
  //   const prefix = data.get("plate_no").match(/\d+\D+|\D+/g);
  //   const postfix = data.get("plate_no").match(/(\d+)$/g);
  //   const jsonData = {
  //     id: editItem.id,
  //     plate_no: data.get("plate_no"),
  //     prefix: prefix[0],
  //     postfix: postfix[0],
  //     province: data.get("province"),
  //     color: data.get("color"),
  //     size_id: data.get("size").split(",")[0],
  //     size: data.get("size").split(",")[1],
  //     brand: data.get("brand"),
  //     model: data.get("model"),
  //   };
  //   UpdateCustomerCar(jsonData).then((data) => {
  //     const { status, msg } = data;
  //     if (status === "SUCCESS") {
  //       setEditItem(null);
  //       fetchCustomerCar();
  //     } else {
  //       if (msg.code === "ER_DUP_ENTRY") {
  //         alert("this plate no already exist");
  //       } else {
  //         console.log(data);
  //       }
  //     }
  //   });
  // };
  // const formFields = (defaults = {}) => (
  //   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  //     <label className="form-control sm:col-span-2">
  //       <span className="label-text">Plate No</span>
  //       <input
  //         type="text"
  //         name="plate_no"
  //         className="input input-bordered"
  //         defaultValue={defaults.plate_no}
  //         required
  //       />
  //     </label>
  //     <label className="form-control">
  //       <span className="label-text">Province</span>
  //       {province && (
  //         <select
  //           name="province"
  //           className="select select-bordered"
  //           defaultValue={defaults.province}
  //           required
  //         >
  //           <option value="">Select</option>
  //           {province.map((item) => (
  //             <option key={item.id} value={item.province}>
  //               {item.province}
  //             </option>
  //           ))}
  //         </select>
  //       )}
  //     </label>
  //     <label className="form-control">
  //       <span className="label-text">Size</span>
  //       {carSize && (
  //         <select
  //           name="size"
  //           className="select select-bordered"
  //           defaultValue={
  //             defaults.size ? `${defaults.size_id},${defaults.size}` : ""
  //           }
  //           required
  //         >
  //           <option value="">Select</option>
  //           {carSize.map(
  //             (item) =>
  //               item.is_available === 1 && (
  //                 <option key={item.id} value={[item.id, item.size]}>
  //                   {item.size}
  //                 </option>
  //               )
  //           )}
  //         </select>
  //       )}
  //     </label>
  //     <label className="form-control sm:col-span-2">
  //       <span className="label-text">Brand</span>
  //       <input
  //         type="text"
  //         name="brand"
  //         className="input input-bordered"
  //         defaultValue={defaults.brand}
  //         required
  //       />
  //     </label>
  //     <label className="form-control sm:col-span-2">
  //       <span className="label-text">Model</span>
  //       <input
  //         type="text"
  //         name="model"
  //         className="input input-bordered"
  //         defaultValue={defaults.model}
  //         required
  //       />
  //     </label>
  //     <label className="form-control sm:col-span-2">
  //       <span className="label-text">Color</span>
  //       <input
  //         type="text"
  //         name="color"
  //         className="input input-bordered"
  //         defaultValue={defaults.color}
  //         required
  //       />
  //     </label>
  //   </div>
  // );

  return (
    <div>
      <button
        className="btn btn-primary font-bold"
        onClick={() => setViewMode("add")}
      >
        + Add Car
      </button>
      {viewMode === "add" && <CustomerAddCar />}
      
    </div>
  );
};

export default CustomerCar;
