import { useEffect, useState } from "react";
import Notification from "../../Notification/Notification";
import {
  GetAllCarSize,
  GetAllService,
  PostAddServiceRates,
} from "../../Modules/Api";

const ServiceRatesAddPage = ({ onSuccess, onBack }) => {
  const [service, setService] = useState([]);
  const [carSize, setCarSize] = useState([]);
  const [errors, setErrors] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    setIsSubmitting(true);
    PostAddServiceRates(data).then(({ status, msg }) => {
      setIsSubmitting(false);
      if (status === "SUCCESS") {
        setErrors("");
        onSuccess?.(msg);
      } else {
        setNotification({
          show: true,
          status: status,
          message: msg,
        });
        setNotificationKey((prev) => prev + 1);
        if (status === "WARNING") {
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
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      {notification.show && (
        <Notification
          key={notificationKey}
          message={notification.message}
          status={notification.status}
        />
      )}

      <form onSubmit={handleAdd} className="space-y-6">
        {/* Service Info Card */}
        <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden">
          <div className="px-5 py-4 bg-base-200/50 border-b border-base-200">
            <h2 className="font-semibold text-base-content flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              Service Information
            </h2>
          </div>
          <div className="p-5 space-y-4">
            {errors && <p className="text-error text-sm">{errors}</p>}
            
            {carSize.length > 0 && service.length > 0 && (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <label className="text-sm font-medium text-base-content/80 sm:w-32">
                    Service <span className="text-error">*</span>
                  </label>
                  <select
                    value={data.service_id}
                    className="select select-bordered w-full max-w-xs"
                    onChange={(e) => setData({ ...data, service_id: e.target.value })}
                    required
                  >
                    <option disabled value="">Pick a service</option>
                    {service.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <label className="text-sm font-medium text-base-content/80 sm:w-32">
                    Car Size <span className="text-error">*</span>
                  </label>
                  <select
                    value={data.car_size_id}
                    className="select select-bordered w-full max-w-xs"
                    onChange={(e) => setData({ ...data, car_size_id: e.target.value })}
                    required
                  >
                    <option disabled value="">Pick a car size</option>
                    {carSize.map((c) => (
                      <option key={c.id} value={c.id}>{c.size}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Pricing Card */}
        {carSize.length > 0 && service.length > 0 && (
          <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden">
            <div className="px-5 py-4 bg-base-200/50 border-b border-base-200">
              <h2 className="font-semibold text-base-content flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
                Pricing & Duration
              </h2>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label className="text-sm font-medium text-base-content/80 sm:w-32">
                  Duration <span className="text-error">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Enter duration"
                    value={data.duration_minute}
                    className="input input-bordered w-full max-w-xs"
                    onChange={(e) => setData({ ...data, duration_minute: e.target.value })}
                    required
                  />
                  <span className="text-sm text-base-content/60">minutes</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label className="text-sm font-medium text-base-content/80 sm:w-32">
                  Price <span className="text-error">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Enter price"
                    value={data.price}
                    className="input input-bordered w-full max-w-xs"
                    onChange={(e) => setData({ ...data, price: e.target.value })}
                    required
                  />
                  <span className="text-sm text-base-content/60">THB</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label className="text-sm font-medium text-base-content/80 sm:w-32">
                  Required Staff <span className="text-error">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="Enter staff count"
                  value={data.required_staff}
                  className="input input-bordered w-full max-w-xs"
                  onChange={(e) => setData({ ...data, required_staff: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        {carSize.length > 0 && service.length > 0 && (
          <div className="flex justify-end gap-3 pt-4 border-t border-base-200">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setData({
                  service_id: "",
                  car_size_id: "",
                  duration_minute: "",
                  price: "",
                  required_staff: "",
                });
                setErrors("");
                onBack?.();
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`btn btn-primary ${isSubmitting ? "loading" : ""}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Service Rate"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ServiceRatesAddPage;
