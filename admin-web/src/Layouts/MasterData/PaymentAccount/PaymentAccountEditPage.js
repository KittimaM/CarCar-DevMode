import React, { useState, useEffect } from "react";
import { GetAllPaymentType, UpdatePaymentAccount } from "../../Modules/Api";
import Notification, {
  isValidImageFile,
} from "../../Notification/Notification";

const baseUrl = process.env.REACT_APP_NODE_API_URL || "";

  const PaymentAccountEditPage = ({ editItem }) => {
  const [paymentType, setPaymentType] = useState([]);
  const [notificationKey, setNotificationKey] = useState(0);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    status: "",
  });
  const [data, setData] = useState({
    id: "",
    payment_type_id: "",
    provider: "",
    account_no: "",
    account_name: "",
    qr_code: "",
  });
  const [qrCodeFile, setQrCodeFile] = useState(null);

  useEffect(() => {
    if (editItem) {
      setData({
        id: editItem.id,
        payment_type_id: String(editItem.payment_type_id),
        provider: editItem.provider,
        account_no: editItem.account_no,
        account_name: editItem.account_name,
        qr_code: editItem.qr_code,
      });
    }
  }, [editItem]);

  const fetchPaymentType = () => {
    GetAllPaymentType().then(({ status, msg }) => {
      if (status === "SUCCESS") {
        setPaymentType(msg);
      } else if (status === "NO DATA") {
        setPaymentType([]);
      }
    });
  };

  useEffect(() => {
    fetchPaymentType();
  }, []);

  const handleEdit = (e) => {
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
    const formData = new FormData();
    formData.append("id", data.id);
    formData.append("payment_type_id", data.payment_type_id);
    formData.append("provider", data.provider);
    formData.append("account_no", data.account_no);
    formData.append("account_name", data.account_name);
    if (qrCodeFile) {
      formData.append("qr_code", qrCodeFile);
    } else if (data.qr_code) {
      formData.append("existing_qr_code", data.qr_code);
    }
    UpdatePaymentAccount(formData).then(({ status, msg, qr_code }) => {
      setNotification({ show: true, status, message: msg });
      setNotificationKey((k) => k + 1);
      if (status === "SUCCESS") {
        setQrCodeFile(null);
        if (qr_code !== undefined) {
          setData((prev) => ({ ...prev, qr_code }));
        }
      }
    });
  };

  const currentQrUrl =
    data.qr_code && baseUrl
      ? `${baseUrl.replace(/\/$/, "")}/${data.qr_code}`
      : null;

  return (
    <div className="space-y-4">
      {notification.show && (
        <Notification
          key={notificationKey}
          message={notification.message}
          status={notification.status}
        />
      )}

      <form onSubmit={handleEdit}>
        <div className="border p-4 bg-base-100 space-y-4 items-center">
          <div className="flex flex-col md:flex-row gap-2 md:items-center font-semibold">
            <span className="w-32">Payment Type</span>
            <select
              value={data.payment_type_id}
              className={`select w-full select-bordered max-w-md ${
                !data.payment_type_id ? `select-error` : ``
              }`}
              onChange={(e) =>
                setData({ ...data, payment_type_id: e.target.value })
              }
              required
            >
              <option disabled value="">
                Pick A Payment Type
              </option>
              {paymentType &&
                paymentType.map((pt) => (
                  <option key={pt.id} value={pt.id}>
                    {pt.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="flex flex-col md:flex-row gap-2 md:items-center font-semibold">
            <span className="w-32">Provider</span>
            <input
              type="text"
              value={data.provider}
              className={`input input-bordered w-full max-w-md ${
                !data.provider ? `input-error` : ``
              }`}
              onChange={(e) => setData({ ...data, provider: e.target.value })}
              required
            />
          </div>
          <div className="flex flex-col md:flex-row gap-2 md:items-center font-semibold">
            <span className="w-32 flex flex-col leading-tight">
              <span>Account No.</span>
              <span className="text-xs">(numbers only)</span>
            </span>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={data.account_no}
              className={`input input-bordered w-full max-w-md ${
                !data.account_no ? `input-error` : ``
              }`}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setData({ ...data, account_no: value });
              }}
              required
            />
          </div>
          <div className="flex flex-col md:flex-row gap-2 md:items-center font-semibold">
            <span className="w-32">Account Name</span>
            <input
              type="text"
              value={data.account_name}
              className={`input input-bordered w-full max-w-md ${
                !data.account_name ? `input-error` : ``
              }`}
              onChange={(e) =>
                setData({ ...data, account_name: e.target.value })
              }
              required
            />
          </div>
          <div className="flex flex-col md:flex-row gap-2 md:items-center font-semibold">
            <span className="w-32 flex flex-col leading-tight">
              <span>Qr Code</span>
              <span className="text-xs text-success">(optional)</span>
            </span>
            <div className="flex flex-col gap-2 w-full max-w-md">
              {currentQrUrl && !qrCodeFile && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-base-content/70">Current:</span>
                  <img
                    key={data.qr_code}
                    src={currentQrUrl}
                    alt="Current QR"
                    className="h-16 w-16 object-contain border rounded"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                className="input input-bordered w-full max-w-md"
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
                <span className="text-sm text-base-content/70">
                  New file: {qrCodeFile.name}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button type="submit" className="btn btn-success text-white">
              UPDATE
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => {
                setData({
                  id: editItem.id,
                  payment_type_id: String(editItem.payment_type_id),
                  provider: editItem.provider,
                  account_no: editItem.account_no,
                  account_name: editItem.account_name,
                  qr_code: editItem.qr_code,
                });
                setQrCodeFile(null);
              }}
            >
              CANCEL
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PaymentAccountEditPage;
