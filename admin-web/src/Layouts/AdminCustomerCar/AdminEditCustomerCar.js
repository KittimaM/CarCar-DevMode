import { useEffect, useState } from "react";
import Notification from "../Notification/Notification";
import {
  GetAdminCustomer,
  GetAllCarSize,
  GetAllProvince,
  UpdateAdminCustomerCar,
} from "../Api";

const AdminEditCustomerCar = ({ editItem }) => {
  console.log("editItem : ", editItem);

  const [customer, setCustomer] = useState([]);
  const [size, setSize] = useState([]);
  const [province, setProvince] = useState([]);
  const [errors, setErrors] = useState([]);
  const [notificationKey, setNotificationKey] = useState(0);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    status: "",
  });
  const [data, setData] = useState({
    id: editItem.car_id,
    customer_id: editItem.customer_id,
    plate_no: editItem.plate_no,
    province: editItem.province,
    brand: editItem.brand,
    model: editItem.model,
    size_id: editItem.size_id,
    color: editItem.color,
  });

  useEffect(() => {
    GetAdminCustomer().then(({ status, msg }) => {
      if (status === "SUCCESS") {
        setCustomer(msg);
      }
    });
    GetAllCarSize().then(({ status, msg }) => {
      if (status === "SUCCESS") {
        setSize(msg);
      }
    });
    GetAllProvince().then(({ status, msg }) => {
      if (status === "SUCCESS") {
        setProvince(msg);
      }
    });
  }, []);

  const handleEditCar = (e) => {
    e.preventDefault();
    UpdateAdminCustomerCar(data).then(({ status, msg }) => {
      if (status === "SUCCESS") {
        setNotification({
          show: true,
          status: status,
          message: data.plate_no + " " + msg,
        });
        setErrors([]);
      } else if (status === "WARNING") {
        setErrors(data.plate_no + " " + msg);
        setData({ ...data, plate_no: null });
      } else if (status === "ERROR") {
        setNotification({
          show: true,
          status: status,
          message: msg,
        });
      }
      setNotificationKey((prev) => prev + 1);
    });
  };

  const handleReset = () => {
    setErrors([]);
    setData({
      id: editItem.car_id,
      customer_id: editItem.customer_id,
      plate_no: editItem.plate_no,
      province: editItem.province,
      brand: editItem.brand,
      model: editItem.model,
      size_id: editItem.size_id,
      color: editItem.color,
    });
  };

  return (
    <div className="space-y-4">
      {notification.show === true && (
        <Notification
          key={notificationKey}
          message={notification.message}
          status={notification.status}
        />
      )}
      <form onSubmit={handleEditCar}>
        <div className="border p-4 bg-base-100 space-y-4 items-center">
          <div className="flex flex-col md:flex-row gap-2 md:items-center font-semibold">
            <span className="w-32">Customer</span>
            <select
              value={data.customer_id}
              className={`select w-full select-bordered max-w-md ${!data.customer_id ? `select-error` : ``}`}
              onChange={(e) =>
                setData({ ...data, customer_id: e.target.value })
              }
              required
            >
              <option disabled={true} value="">
                Pick A Customer
              </option>
              {customer &&
                customer.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.phone} : {c.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex flex-col md:flex-row gap-2 md:items-center font-semibold">
            <span className="w-32">Plate No</span>
            <input
              type="text"
              value={data.plate_no}
              className={`input input-bordered w-full max-w-md ${!data.plate_no ? `input-error` : ``}`}
              onChange={(e) => {
                setData({ ...data, plate_no: e.target.value });
              }}
              required
            />
          </div>
          {errors && <p className="text-red-500 text-md">{errors}</p>}

          <div className="flex flex-col md:flex-row gap-2 md:items-center font-semibold">
            <span className="w-32">Province</span>
            <select
              value={data.province}
              className={`select w-full select-bordered max-w-md ${!data.province ? `select-error` : ``}`}
              onChange={(e) => setData({ ...data, province: e.target.value })}
              required
            >
              <option disabled={true} value="">
                Pick A Province
              </option>
              {province &&
                province.map((p) => (
                  <option key={p.id} value={p.province}>
                    {p.province}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex flex-col md:flex-row gap-2 md:items-center font-semibold">
            <span className="w-32">Brand</span>
            <input
              type="text"
              value={data.brand}
              className={`input input-bordered w-full max-w-md ${!data.brand ? `input-error` : ``}`}
              onChange={(e) => {
                setData({ ...data, brand: e.target.value });
              }}
              required
            />
          </div>

          <div className="flex flex-col md:flex-row gap-2 md:items-center font-semibold">
            <span className="w-32">Color</span>
            <input
              type="text"
              value={data.color}
              className={`input input-bordered w-full max-w-md ${!data.color ? `input-error` : ``}`}
              onChange={(e) => {
                setData({ ...data, color: e.target.value });
              }}
              required
            />
          </div>

          <div className="flex flex-col md:flex-row gap-2 md:items-center font-semibold">
            <span className="w-32 flex flex-col leading-tight">
              <span>Model</span>
              <span className="text-xs text-success">(optional)</span>
            </span>

            <input
              type="text"
              value={data.model}
              className={`input input-bordered w-full max-w-md`}
              onChange={(e) => {
                setData({ ...data, model: e.target.value });
              }}
            />
          </div>

          <div className="flex flex-col md:flex-row gap-2 md:items-center font-semibold">
            <span className="w-32">Size</span>
            <select
              value={data.size_id}
              className={`select w-full select-bordered max-w-md ${!data.size_id ? `select-error` : ``}`}
              onChange={(e) => setData({ ...data, size_id: e.target.value })}
              required
            >
              <option disabled={true} value="">
                Pick A Car's Size
              </option>
              {size &&
                size.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.size}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex gap-2 mt-4">
            <button type="submit" className="btn btn-success text-white">
              SUBMIT
            </button>
            <button type="button" className="btn" onClick={handleReset}>
              CANCEL
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminEditCustomerCar;
