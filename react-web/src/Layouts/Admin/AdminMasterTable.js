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
        <div role="tablist" className="tabs tabs-lifted">
          <input
            type="radio"
            name="tab"
            role="tab"
            className="tab"
            aria-label="Onleave Type"
          />
          <div
            role="tabpanel"
            className="tab-content bg-base-100 border-base-300 rounded-box p-6"
          >
            <AdminOnLeaveType permission={onLeaveTypePermission} />
          </div>

          <input
            type="radio"
            name="tab"
            role="tab"
            className="tab"
            aria-label="Payment Type"
          />
          <div
            role="tabpanel"
            className="tab-content bg-base-100 border-base-300 rounded-box p-6"
          >
            <AdminPaymentType permission={paymentTypePermission} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMasterTable;
