import { useEffect, useState } from "react";
import Notification from "../../Notification/Notification";
import {
  GetAllCarSize,
  GetAllService,
  PostAddServiceRates,
} from "../../Modules/Api";

const ServiceRatesAddPage = () => {
  const [service, setService] = useState([]);
  const [carSize, setCarSize] = useState([]);
  const [errors, setErrors] = useState("");
  const [notificationKey, setNotificationKey] = useState(0);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    status: "",
  });
  const [data, setData] = useState({
    service_id: "",
    car_size_id: "",
    duration_minute: "",
    price: "",
    required_staff: "",
  });

  useEffect(() => {
    GetAllService().then(({ status, msg }) => {
      if (status === "SUCCESS") {
        setService(msg);
      } else if (status === "NO DATA") {
        setService([]);
        setErrors("No services or car sizes are available");
      }
    });

    GetAllCarSize().then(({ status, msg }) => {
      if (status === "SUCCESS") {
        setCarSize(msg);
      } else if (status === "NO DATA") {
        setCarSize([]);
        setErrors("No services or car sizes are available");
      }
    });
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    PostAddServiceRates(data).then(({ status, msg }) => {
      setNotification({
        show: true,
        status: status,
        message: msg,
      });
      setNotificationKey((prev) => prev + 1);
      if (status === "SUCCESS") {
        setErrors([]);
      } else if (status === "WARNING") {
        setErrors(msg);
        setData({
          service_id: "",
          car_size_id: "",
          duration_minute: "",
          price: "",
          required_staff: "",
        });
      } else if (status === "ERROR") {
        setErrors(msg);
      }
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
      <form onSubmit={handleAdd}>
        <div className="border p-4 bg-base-100 space-y-4 items-center">
          {errors && <p className="text-red-500 text-md">{errors}</p>}
          {carSize.length > 0 && service.length > 0 && (
            <>
              <div className="flex flex-col md:flex-row gap-2 md:items-center font-semibold">
                <span className="w-32">Service</span>
                <select
                  value={data.service_id}
                  className={`select w-full select-bordered max-w-md ${
                    !data.service_id ? `select-error` : ``
                  }`}
                  onChange={(e) =>
                    setData({ ...data, service_id: e.target.value })
                  }
                  required
                >
                  <option disabled={true} value="">
                    Pick A Service
                  </option>
                  {service &&
                    service.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex flex-col md:flex-row gap-2 md:items-center font-semibold">
                <span className="w-32">Car Size</span>
                <select
                  value={data.car_size_id}
                  className={`select w-full select-bordered max-w-md ${
                    !data.car_size_id ? `select-error` : ``
                  }`}
                  onChange={(e) =>
                    setData({ ...data, car_size_id: e.target.value })
                  }
                  required
                >
                  <option disabled={true} value="">
                    Pick A Car Size
                  </option>
                  {carSize &&
                    carSize.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.size}
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex flex-col md:flex-row gap-2 md:items-center font-semibold">
                <span className="w-32">Duration (Minutes)</span>
                <input
                  type="number"
                  value={data.duration_minute}
                  className={`input input-bordered w-full max-w-md ${
                    !data.duration_minute ? `input-error` : ``
                  }`}
                  onChange={(e) =>
                    setData({ ...data, duration_minute: e.target.value })
                  }
                  required
                />
              </div>

              <div className="flex flex-col md:flex-row gap-2 md:items-center font-semibold">
                <span className="w-32">Price</span>
                <input
                  type="number"
                  value={data.price}
                  className={`input input-bordered w-full max-w-md ${
                    !data.price ? `input-error` : ``
                  }`}
                  onChange={(e) => setData({ ...data, price: e.target.value })}
                  required
                />
              </div>

              <div className="flex flex-col md:flex-row gap-2 md:items-center font-semibold">
                <span className="w-32">Required Staff</span>
                <input
                  type="number"
                  min="1"
                  value={data.required_staff}
                  className={`input input-bordered w-full max-w-md ${
                    !data.required_staff ? `input-error` : ``
                  }`}
                  onChange={(e) => {
                    setData({ ...data, required_staff: e.target.value });
                  }}
                  required
                />
              </div>

              <div className="flex gap-2 mt-4">
                <button type="submit" className="btn btn-success text-white">
                  SUBMIT
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    setData({
                      service_id: "",
                      car_size_id: "",
                      duration_minute: "",
                      price: "",
                      required_staff: "",
                    });
                    setErrors("");
                  }}
                >
                  CANCEL
                </button>
              </div>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default ServiceRatesAddPage;
