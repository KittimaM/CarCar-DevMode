import React, { useState, useEffect } from "react";
import { GetAllPaymentType, PostAddPaymentAccount } from "../../Modules/Api";
import Notification, {
  isValidImageFile,
} from "../../Notification/Notification";

const PaymentAccountAddPage = ({ onSuccess, onBack }) => {
  const [paymentType, setPaymentType] = useState([]);
  const [data, setData] = useState({
    payment_type_id: "",
    provider: "",
    account_no: "",
    account_name: "",
  });
  const [qrCodeFile, setQrCodeFile] = useState(null);
  const [errors, setErrors] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notificationKey, setNotificationKey] = useState(0);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    status: "",
  });

  useEffect(() => {
    GetAllPaymentType().then(({ status, msg }) => {
      if (status === "SUCCESS") {
        setPaymentType(msg);
      } else if (status === "NO DATA") {
        setPaymentType([]);
        setErrors("No payment types available");
      }
    });
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    if (qrCodeFile) {
      const check = isValidImageFile(qrCodeFile);
      if (!check.valid) {
        setNotification({
          show: true,
          status: "ERROR",
          message: check.message,
        });
        setNotificationKey((k) => k + 1);
        return;
      }
    }
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("payment_type_id", data.payment_type_id);
    formData.append("provider", data.provider);
    formData.append("account_no", data.account_no);
    formData.append("account_name", data.account_name);
    if (qrCodeFile) {
      formData.append("qr_code", qrCodeFile);
    }
    PostAddPaymentAccount(formData).then(({ status, msg }) => {
      setIsSubmitting(false);
      if (status === "SUCCESS") {
        setErrors("");
        onSuccess?.(msg);
      } else {
        setNotification({ show: true, status, message: msg });
        setNotificationKey((k) => k + 1);
        if (status === "ERROR" || status === "WARNING") {
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
        {/* Account Info Card */}
        <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden">
          <div className="px-5 py-4 bg-base-200/50 border-b border-base-200">
            <h2 className="font-semibold text-base-content flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent" viewBox="0 0 20 20" fill="currentColor">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
              </svg>
              Account Information
            </h2>
          </div>
          <div className="p-5 space-y-4">
            {errors && <p className="text-error text-sm">{errors}</p>}

            {paymentType.length > 0 && (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <label className="text-sm font-medium text-base-content/80 sm:w-32">
                    Payment Type <span className="text-error">*</span>
                  </label>
                  <select
                    value={data.payment_type_id}
                    className="select select-bordered w-full max-w-xs"
                    onChange={(e) => setData({ ...data, payment_type_id: e.target.value })}
                    required
                  >
                    <option disabled value="">Pick a payment type</option>
                    {paymentType.map((pt) => (
                      <option key={pt.id} value={pt.id}>{pt.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <label className="text-sm font-medium text-base-content/80 sm:w-32">
                    Provider <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter provider name"
                    value={data.provider}
                    className="input input-bordered w-full max-w-xs"
                    onChange={(e) => setData({ ...data, provider: e.target.value })}
                    required
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <label className="text-sm font-medium text-base-content/80 sm:w-32">
                    Account No. <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Enter account number"
                    value={data.account_no}
                    className="input input-bordered w-full max-w-xs tabular-nums"
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setData({ ...data, account_no: value });
                    }}
                    required
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <label className="text-sm font-medium text-base-content/80 sm:w-32">
                    Account Name <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter account name"
                    value={data.account_name}
                    className="input input-bordered w-full max-w-xs"
                    onChange={(e) => setData({ ...data, account_name: e.target.value })}
                    required
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* QR Code Card */}
        {paymentType.length > 0 && (
          <div className="bg-base-100 border border-base-300 rounded-xl overflow-hidden">
            <div className="px-5 py-4 bg-base-200/50 border-b border-base-200">
              <h2 className="font-semibold text-base-content flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2v1h1V5h-1z" clipRule="evenodd" />
                  <path d="M11 4a1 1 0 10-2 0v1a1 1 0 002 0V4zM10 7a1 1 0 011 1v1h2a1 1 0 110 2h-3a1 1 0 01-1-1V8a1 1 0 011-1zM16 9a1 1 0 100 2 1 1 0 000-2zM9 13a1 1 0 011-1h1a1 1 0 110 2v2a1 1 0 11-2 0v-3zM16 13a1 1 0 10-2 0v3a1 1 0 102 0v-3z" />
                </svg>
                QR Code
                <span className="text-xs text-success font-normal">(optional)</span>
              </h2>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label className="text-sm font-medium text-base-content/80 sm:w-32">
                  Upload QR
                </label>
                <div className="flex flex-col gap-2 w-full max-w-xs">
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    className="file-input file-input-bordered w-full"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      if (!file) {
                        setQrCodeFile(null);
                        return;
                      }
                      const check = isValidImageFile(file);
                      if (!check.valid) {
                        setNotification({
                          show: true,
                          status: "ERROR",
                          message: check.message,
                        });
                        setNotificationKey((k) => k + 1);
                        setQrCodeFile(null);
                        e.target.value = "";
                        return;
                      }
                      setQrCodeFile(file);
                    }}
                  />
                  {qrCodeFile && (
                    <span className="text-sm text-success">
                      Selected: {qrCodeFile.name}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        {paymentType.length > 0 && (
          <div className="flex justify-end gap-3 pt-4 border-t border-base-200">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setData({ payment_type_id: "", provider: "", account_no: "", account_name: "" });
                setQrCodeFile(null);
                setErrors("");
                onBack?.();
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`btn btn-accent ${isSubmitting ? "loading" : ""}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Payment Account"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default PaymentAccountAddPage;
