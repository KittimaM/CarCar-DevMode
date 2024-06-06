import React, { useState } from "react";
import AdminCustomer from "./AdminCustomer";
import AdminStaff from "./AdminStaff";
import AdminCustomerCar from "./AdminCustomerCar";

const AdminUser = ({ staffPermission, customerPermission }) => {
  const [isSelectedStaff, setIsSelectedStaff] = useState(false);
  const [isSelectedCustomer, setSelectedCustomer] = useState(false);
  const [isSelectedCustomerCar, setIsSelectedCustomerCar] = useState(false);

  const handleSelectedContent = (event) => {
    event.preventDefault();
    const value = event.currentTarget.getAttribute("data-value");
    setIsSelectedStaff(value == "staff" ? true : false);
    setIsSelectedCustomerCar(value == "customerCar" ? true : false);
    setSelectedCustomer(value == "customer" ? true : false);
  };

  return (
    <>
      <div className="ml-80 mt-16">
        <div className="text-lg bg-yellow-50 mb-5 ">Admin User page </div>
        {staffPermission && staffPermission.includes("1") && (
          <button
            data-value="staff"
            className="btn"
            disabled={isSelectedStaff}
            onClick={handleSelectedContent}
          >
            Staff
          </button>
        )}
        {customerPermission && customerPermission.includes("1") && (
          <div>
            <button
              data-value="customer"
              className="btn"
              disabled={isSelectedCustomer}
              onClick={handleSelectedContent}
            >
              Customer
            </button>
            <button
              data-value="customerCar"
              className="btn"
              disabled={isSelectedCustomerCar}
              onClick={handleSelectedContent}
            >
              Customer's Car
            </button>
          </div>
        )}
        {isSelectedStaff && <AdminStaff permission={staffPermission} />}
        {isSelectedCustomer && (
          <AdminCustomer permission={customerPermission} />
        )}
        {isSelectedCustomerCar && (
          <AdminCustomerCar permission={customerPermission} />
        )}
      </div>
    </>
  );
};

export default AdminUser;
