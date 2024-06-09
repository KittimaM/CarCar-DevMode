import React, { useEffect, useState } from "react";
import {
  DeleteCustomerCar,
  GetAllCarSize,
  GetAllProvince,
  GetCustomerCar,
  PostAddCustomerCar,
  UpdateCustomerCar,
} from "../Api";
import URLList from "../Url/URLList";
//----------------------------
import { Button } from "../Module";

const CustomerCar = () => {
  const [car, setCar] = useState(null);
  const [carSize, setCarSize] = useState(null);
  const [province, setProvince] = useState(null);
  const [editItem, setEditItem] = useState(null);

  const fetchCustomerCar = async () => {
    GetCustomerCar().then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        setCar(msg);
      } else {
        setCar(null);
        console.log(data);
      }
    });
  };

  useEffect(() => {
    fetchCustomerCar();
    GetAllCarSize(URLList.AdminCarSizeURL).then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        setCarSize(msg);
      } else {
        setCarSize(null);
        console.log(data);
      }
    });
    GetAllProvince(URLList.ProvinceURL).then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        setProvince(msg);
      } else {
        setProvince(null);
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
      if (status == "SUCCESS") {
        fetchCustomerCar();
      } else {
        if (msg.code == "ER_DUP_ENTRY") {
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
      if (status == "SUCCESS") {
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
      if (status == "SUCCESS") {
        setEditItem(null);
        fetchCustomerCar();
      } else {
        if (msg.code == "ER_DUP_ENTRY") {
          alert("this plate no already exist");
        } else {
          console.log(data);
        }
      }
    });
  };
  return (
    <>
      <div className="navbar bg-neutral text-neutral-content">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">Carcare</a>
        </div>
        <div className="flex-none gap-2">
          {/* <div className="form-control">
                  <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
                </div> */}
          <div>
            <Button to="/customer/car" name="Customer Car" />
          </div>
          <div>
            <Button to="/customer/profile" name="Profile" />
          </div>
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <div className="badge m-2">Phattraporn Bunjongket</div>
              {/* <li>
                      <a className="justify-between">
                        Profile
                      </a>
                    </li> */}
              <li>
                <a>Settings</a>
              </li>
              <li>
                <a>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div>
        <form onSubmit={handleCustomerAddCar}>
          <label name="plate_no">plate_no</label>
          <input type="text" name="plate_no" />
          <label name="province">province</label>
          {province && (
            <select name="province">
              {province.map((item) => (
                <option key={item.id} value={item.province}>
                  {item.province}
                </option>
              ))}
            </select>
          )}
          <label name="brand">brand</label>
          <input type="text" name="brand" />
          <label name="model">model</label>
          <input type="text" name="model" />
          <label name="color">color</label>
          <input type="text" name="color" />
          {carSize && (
            <select name="size">
              {carSize.map(
                (item) =>
                  item.is_available == 1 && (
                    <option key={item.id} value={[item.id, item.size]}>
                      {item.size}
                    </option>
                  )
              )}
            </select>
          )}
          <button type="submit" className="btn">
            Submit
          </button>
        </form>
        {car && (
          <table>
            <thead>
              <tr>
                <td>plate_no</td>
                <td>province</td>
                <td>brand</td>
                <td>model</td>
                <td>size</td>
                <td>color</td>
                <td>Edit</td>
                <td>Delete</td>
              </tr>
            </thead>
            <tbody>
              {car.map((item) => (
                <tr key={item.plate_no}>
                  <td>{item.plate_no}</td>
                  <td>{item.province}</td>
                  <td>{item.brand}</td>
                  <td>{item.model}</td>
                  <td>{item.size}</td>
                  <td>{item.color}</td>
                  <td>
                    <button
                      className="btn"
                      onClick={() => handleSelectEditId(item)}
                      value={item.plate_no}
                    >
                      Edit
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn"
                      onClick={handleDeleteCustomerCar}
                      value={item.id}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {editItem && (
          <form onSubmit={handleEditCustomerCar}>
            <label name="plate_no">plate_no</label>
            <input
              type="text"
              name="plate_no"
              defaultValue={editItem.plate_no}
            />
            <label name="province">province</label>
            {province && (
              <select name="province" defaultValue={editItem.province}>
                {province.map((item) => (
                  <option key={item.id} value={item.province}>
                    {item.province}
                  </option>
                ))}
              </select>
            )}
            <label name="brand">brand</label>
            <input type="text" name="brand" defaultValue={editItem.brand} />
            <label name="model">model</label>
            <input type="text" name="model" defaultValue={editItem.model} />
            <label name="color">color</label>
            <input type="text" name="color" defaultValue={editItem.color} />
            {carSize && (
              <select
                name="size"
                defaultValue={[editItem.size_id, editItem.size]}
              >
                {carSize.map(
                  (item) =>
                    item.is_available == 1 && (
                      <option key={item.id} value={[item.id, item.size]}>
                        {item.size}
                      </option>
                    )
                )}
              </select>
            )}
            <button type="submit" className="btn">
              Submit
            </button>
          </form>
        )}
      </div>
    </>
  );
};

export default CustomerCar;
