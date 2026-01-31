import React, { useEffect, useState } from "react";
import {
  DeleteCustomerCar,
  GetAllCarSize,
  GetAllProvince,
  GetCustomerCar,
  PostAddCustomerCar,
  UpdateCustomerCar,
  GetCustomerProfile,
} from "../Modules/Api"

const CustomerCar = () => {
  const [car, setCar] = useState(null);
  const [carSize, setCarSize] = useState(null);
  const [province, setProvince] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [profile, setProfile] = useState(null);

  const fetchCustomerCar = async () => {
    GetCustomerCar().then((data) => {
      const { status, msg } = data;
      if (status === "SUCCESS") {
        setCar(msg);
      } else {
        setCar(null);
        console.log(data);
      }
    });
  };

  useEffect(() => {
    fetchCustomerCar();
    GetAllCarSize().then((data) => {
      const { status, msg } = data;
      if (status === "SUCCESS") {
        setCarSize(msg);
      } else {
        setCarSize(null);
        console.log(data);
      }
    });
    GetAllProvince().then((data) => {
      const { status, msg } = data;
      if (status === "SUCCESS") {
        setProvince(msg);
      } else {
        setProvince(null);
        console.log(data);
      }
    });
    GetCustomerProfile().then((data) => {
      const { status, msg } = data;
      if (status === "SUCCESS") {
        setProfile(msg[0]);
      } else {
        console.log(data);
      }
    });
  }, []);

  const handleCustomerAddCar = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const prefix = data.get("plate_no").match(/\d+\D+|\D+/g);
    const postfix = data.get("plate_no").match(/(\d+)$/g);
    const jsonData = {
      plate_no: data.get("plate_no"),
      prefix: prefix[0],
      postfix: postfix[0],
      province: data.get("province"),
      color: data.get("color"),
      size_id: data.get("size").split(",")[0],
      size: data.get("size").split(",")[1],
      brand: data.get("brand"),
      model: data.get("model"),
    };

    PostAddCustomerCar(jsonData).then((data) => {
      const { status, msg } = data;
      if (status === "SUCCESS") {
        fetchCustomerCar();
      } else {
        if (msg.code === "ER_DUP_ENTRY") {
          alert("this plate no already exist");
        } else {
          console.log(data);
        }
      }
    });
  };

  const handleSelectEditId = (selectedItem) => {
    setEditItem(selectedItem);
  };

  const handleDeleteCustomerCar = (event) => {
    event.preventDefault();
    const jsonData = {
      id: event.target.value,
    };
    DeleteCustomerCar(jsonData).then((data) => {
      const { status, msg } = data;
      if (status === "SUCCESS") {
        fetchCustomerCar();
      } else {
        console.log(data);
      }
    });
  };

  const handleEditCustomerCar = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const prefix = data.get("plate_no").match(/\d+\D+|\D+/g);
    const postfix = data.get("plate_no").match(/(\d+)$/g);
    const jsonData = {
      id: editItem.id,
      plate_no: data.get("plate_no"),
      prefix: prefix[0],
      postfix: postfix[0],
      province: data.get("province"),
      color: data.get("color"),
      size_id: data.get("size").split(",")[0],
      size: data.get("size").split(",")[1],
      brand: data.get("brand"),
      model: data.get("model"),
    };
    UpdateCustomerCar(jsonData).then((data) => {
      const { status, msg } = data;
      if (status === "SUCCESS") {
        setEditItem(null);
        fetchCustomerCar();
      } else {
        if (msg.code === "ER_DUP_ENTRY") {
          alert("this plate no already exist");
        } else {
          console.log(data);
        }
      }
    });
  };
  const formFields = (defaults = {}) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <label className="form-control sm:col-span-2">
        <span className="label-text">Plate No</span>
        <input type="text" name="plate_no" className="input input-bordered" defaultValue={defaults.plate_no} required />
      </label>
      <label className="form-control">
        <span className="label-text">Province</span>
        {province && (
          <select name="province" className="select select-bordered" defaultValue={defaults.province} required>
            <option value="">Select</option>
            {province.map((item) => (
              <option key={item.id} value={item.province}>{item.province}</option>
            ))}
          </select>
        )}
      </label>
      <label className="form-control">
        <span className="label-text">Size</span>
        {carSize && (
          <select name="size" className="select select-bordered" defaultValue={defaults.size ? `${defaults.size_id},${defaults.size}` : ""} required>
            <option value="">Select</option>
            {carSize.map((item) =>
              item.is_available === 1 && (
                <option key={item.id} value={[item.id, item.size]}>{item.size}</option>
              )
            )}
          </select>
        )}
      </label>
      <label className="form-control sm:col-span-2">
        <span className="label-text">Brand</span>
        <input type="text" name="brand" className="input input-bordered" defaultValue={defaults.brand} required />
      </label>
      <label className="form-control sm:col-span-2">
        <span className="label-text">Model</span>
        <input type="text" name="model" className="input input-bordered" defaultValue={defaults.model} required />
      </label>
      <label className="form-control sm:col-span-2">
        <span className="label-text">Color</span>
        <input type="text" name="color" className="input input-bordered" defaultValue={defaults.color} required />
      </label>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold">My Cars</h2>

      {/* Add Car Form */}
      <div className="bg-base-200/50 rounded-lg p-4 sm:p-6">
        <h3 className="font-semibold mb-4">Add New Car</h3>
        <form onSubmit={handleCustomerAddCar} className="space-y-4">
          {formFields()}
          <button type="submit" className="btn btn-primary w-full sm:w-auto min-h-11">Add Car</button>
        </form>
      </div>

      {/* Car List */}
      {car && car.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">Your Cars</h3>
          {/* Mobile: Cards */}
          <div className="block md:hidden space-y-3">
            {car.map((item) => (
              <div key={item.plate_no} className="bg-base-200/50 rounded-lg p-4 border border-base-300">
                <p className="font-bold text-lg">{item.plate_no} {item.province}</p>
                <p className="text-sm text-base-content/70">{item.brand} {item.model} • {item.color} • {item.size}</p>
                <div className="flex gap-2 mt-3">
                  <button className="btn btn-sm btn-outline flex-1" onClick={() => handleSelectEditId(item)}>Edit</button>
                  <button className="btn btn-sm btn-error btn-outline flex-1" onClick={handleDeleteCustomerCar} value={item.id}>Delete</button>
                </div>
              </div>
            ))}
          </div>
          {/* Desktop: Table */}
          <div className="hidden md:block overflow-x-auto rounded-lg border border-base-300">
            <table className="table">
              <thead>
                <tr>
                  <th>Plate</th>
                  <th>Province</th>
                  <th>Brand</th>
                  <th>Model</th>
                  <th>Size</th>
                  <th>Color</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {car.map((item) => (
                  <tr key={item.plate_no}>
                    <td className="font-medium">{item.plate_no}</td>
                    <td>{item.province}</td>
                    <td>{item.brand}</td>
                    <td>{item.model}</td>
                    <td>{item.size}</td>
                    <td>{item.color}</td>
                    <td className="text-right">
                      <button className="btn btn-sm btn-ghost" onClick={() => handleSelectEditId(item)}>Edit</button>
                      <button className="btn btn-sm btn-ghost text-error" onClick={handleDeleteCustomerCar} value={item.id}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Modal/Form */}
      {editItem && (
        <div className="bg-base-200/50 rounded-lg p-4 sm:p-6 border-2 border-primary/30">
          <h3 className="font-semibold mb-4">Edit Car</h3>
          <form onSubmit={handleEditCustomerCar} className="space-y-4">
            {formFields(editItem)}
            <div className="flex gap-2">
              <button type="button" className="btn btn-ghost flex-1" onClick={() => setEditItem(null)}>Cancel</button>
              <button type="submit" className="btn btn-primary flex-1">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CustomerCar;
