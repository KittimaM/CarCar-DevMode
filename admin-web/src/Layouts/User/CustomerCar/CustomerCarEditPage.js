import { useEffect, useState } from "react";
import Notification from "../../Notification/Notification";
import {
  GetAdminCustomer,
  GetAllProvince,
  GetAllCarSize,
  UpdateAdminCustomerCar,
} from "../../Modules/Api";

const CustomerCarEditPage = ({ editItem, onBack, onSuccess }) => {
  const [data, setData] = useState({
    ...editItem,
  });
  const [customer, setCustomer] = useState([]);
  const [size, setSize] = useState([]);
  const [province, setProvince] = useState([]);
  const [errors, setErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notificationKey, setNotificationKey] = useState(0);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    status: "",
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
    setIsSubmitting(true);
    UpdateAdminCustomerCar(data).then(({ status, msg }) => {
      setIsSubmitting(false);
      if (status === "SUCCESS") {
        setErrors([]);
        onSuccess?.(msg);
      } else if (status === "WARNING") {
        setErrors(data.plate_no + " " + msg);
        setData({ ...data, plate_no: editItem.plate_no });
        setNotification({ show: true, status, message: msg });
        setNotificationKey((prev) => prev + 1);
      } else if (status === "ERROR") {
        setNotification({ show: true, status, message: msg });
        setNotificationKey((prev) => prev + 1);
      } else {
        setNotification({ show: true, status, message: msg });
        setNotificationKey((prev) => prev + 1);
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

      <form onSubmit={handleEditCar} className="space-y-6">
        {/* Owner Card */}
        <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden">
          <div className="px-5 py-4 bg-base-200/50 border-b border-base-200">
            <h2 className="font-semibold text-base-content flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              Owner Information
            </h2>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="text-sm font-medium text-base-content/80 sm:w-32">
                Customer <span className="text-error">*</span>
              </label>
              <select
                value={data.customer_id}
                className="select select-bordered w-full max-w-sm"
                onChange={(e) =>
                  setData({ ...data, customer_id: e.target.value })
                }
                required
              >
                <option disabled value="">
                  Select a customer
                </option>
                {customer &&
                  customer.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.phone} - {c.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>

        {/* Vehicle Info Card */}
        <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden">
          <div className="px-5 py-4 bg-base-200/50 border-b border-base-200">
            <h2 className="font-semibold text-base-content flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h3.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1v-2a1 1 0 00-.293-.707l-3-3A1 1 0 0016 7h-1V5a1 1 0 00-1-1H3zm11 4V7h1.586L18 9.414V10h-4z" />
              </svg>
              Vehicle Details
            </h2>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="text-sm font-medium text-base-content/80 sm:w-32">
                Plate No <span className="text-error">*</span>
              </label>
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Enter plate number"
                  value={data.plate_no || ""}
                  className="input input-bordered w-full max-w-xs"
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\u0E00-\u0E7F0-9]/g, "");
                    setData({ ...data, plate_no: value });
                  }}
                  required
                />
                {errors && <p className="text-error text-sm mt-1">{errors}</p>}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="text-sm font-medium text-base-content/80 sm:w-32">
                Province <span className="text-error">*</span>
              </label>
              <select
                value={data.province_id}
                className="select select-bordered w-full max-w-xs"
                onChange={(e) =>
                  setData({ ...data, province_id: e.target.value })
                }
                required
              >
                <option disabled value="">
                  Select a province
                </option>
                {province &&
                  province.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.province}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="text-sm font-medium text-base-content/80 sm:w-32">
                Brand <span className="text-error">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Toyota, Honda"
                value={data.brand}
                className="input input-bordered w-full max-w-xs"
                onChange={(e) => {
                  setData({ ...data, brand: e.target.value });
                }}
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="text-sm font-medium text-base-content/80 sm:w-32">Model</label>
              <input
                type="text"
                placeholder="e.g., Camry, Civic (optional)"
                value={data.model || ""}
                className="input input-bordered w-full max-w-xs"
                onChange={(e) => {
                  setData({ ...data, model: e.target.value });
                }}
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="text-sm font-medium text-base-content/80 sm:w-32">
                Color <span className="text-error">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., White, Black"
                value={data.color}
                className="input input-bordered w-full max-w-xs"
                onChange={(e) => {
                  setData({ ...data, color: e.target.value });
                }}
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="text-sm font-medium text-base-content/80 sm:w-32">
                Size <span className="text-error">*</span>
              </label>
              <select
                value={data.size_id}
                className="select select-bordered w-full max-w-xs"
                onChange={(e) => setData({ ...data, size_id: e.target.value })}
                required
              >
                <option disabled value="">
                  Select size
                </option>
                {size &&
                  size.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.size}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-base-200">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => onBack?.()}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`btn btn-accent ${isSubmitting ? "loading" : ""}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerCarEditPage;
