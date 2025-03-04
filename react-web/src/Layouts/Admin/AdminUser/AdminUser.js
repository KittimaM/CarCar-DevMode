import React from "react";
import AdminCustomer from "./AdminCustomer";
import AdminStaff from "./AdminStaff";
import AdminCustomerCar from "./AdminCustomerCar";

const AdminUser = ({ staffPermission, customerPermission }) => {
  return (
    <>
      <div>
        <div className="text-lg bg-yellow-50 mb-5 ">Admin User page </div>
        <div role="tablist" className="tabs tabs-lifted">
          <input
            type="radio"
            name="tab"
            role="tab"
            className="tab"
            aria-label="Staff"
          />
          <div
            role="tabpanel"
            className="tab-content bg-base-100 border-base-300 rounded-box p-6"
          >
            <AdminStaff permission={staffPermission} />
          </div>

          <input
            type="radio"
            name="tab"
            role="tab"
            className="tab"
            aria-label="Customer"
          />
          <div
            role="tabpanel"
            className="tab-content bg-base-100 border-base-300 rounded-box p-6"
          >
            <AdminCustomer permission={customerPermission} />
          </div>

          <input
            type="radio"
            name="tab"
            role="tab"
            className="tab"
            aria-label="Customer's Car"
          />
          <div
            role="tabpanel"
            className="tab-content bg-base-100 border-base-300 rounded-box p-6"
          >
            <AdminCustomerCar permission={customerPermission} />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminUser;
