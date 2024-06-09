import React, { useState } from "react";
import AdminOnLeaveType from "./AdminOnLeaveType";
import AdminPaymentType from "./AdminPaymentType";

const AdminMasterTable = ({ onLeaveTypePermission, paymentTypePermission }) => {
  const [isOnLeaveType, setIsOnLeaveType] = useState(false);
  const [isPaymentType, setIsPaymentType] = useState(false);

  const handleSelectedContent = (event) => {
    event.preventDefault();
    const value = event.currentTarget.getAttribute("data-value");
    setIsOnLeaveType(value == "onLeaveType" ? true : false);
    setIsPaymentType(value == "paymentType" ? true : false);
  };
  return (
    <div>
      <div className="ml-80 mt-16">
        <div className="text-lg bg-yellow-100 mb-5 ">Master Table</div>
        {onLeaveTypePermission && onLeaveTypePermission.includes("1") && (
          <button
            onClick={handleSelectedContent}
            data-value="onLeaveType"
            className="btn"
            disabled={isOnLeaveType}
          >
            OnLeave Type
          </button>
        )}
        {paymentTypePermission && paymentTypePermission.includes("1") && (
          <button
            onClick={handleSelectedContent}
            data-value="paymentType"
            className="btn"
            disabled={isPaymentType}
          >
            paymentType
          </button>
        )}
        {isOnLeaveType && (
          <AdminOnLeaveType permission={onLeaveTypePermission} />
        )}
        {isPaymentType && (
          <AdminPaymentType permission={paymentTypePermission} />
        )}
      </div>
    </div>
  );
};

export default AdminMasterTable;
