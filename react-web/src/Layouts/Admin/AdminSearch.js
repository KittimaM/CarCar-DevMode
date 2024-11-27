import React, { useEffect, useState, useRef } from "react";
import {
  GetAdminAllActiveTemplate,
  GetAdminCustomer,
  GetAdminCustomerCar,
  GetAdminSearchFilter,
  GetAdminSearchResult,
} from "../Api";

const AdminSearch = ({ data }) => {
  const { labelValue } = data;
  const [filterList, setFilterList] = useState([]);
  const [subOptions, setSubOptions] = useState({});
  const [searchResults, setSearchResults] = useState();
  const [isShowOptions, setIsShowOptions] = useState(false);
  const [customer, setCustomer] = useState([]);
  const [template, setTemplate] = useState();
  const printRef = useRef();

  useEffect(() => {
    GetAdminSearchFilter().then((data) => {
      const { status, msg } = data;
      if (status === "SUCCESS") {
        setFilterList(msg);

        msg.forEach((filter) => {
          const { data_value } = filter;
          switch (data_value) {
            case "customer_name":
              GetAdminCustomer().then((customer) => {
                const { status, msg } = customer;
                if (status === "SUCCESS") {
                  const options = msg.map((item) => ({
                    id: item.id,
                    label: item.name,
                  }));
                  setSubOptions((prevOptions) => ({
                    ...prevOptions,
                    [data_value]: options,
                  }));
                } else {
                  console.error(customer);
                }
              });
              break;
            case "customer_carno":
              GetAdminCustomerCar().then((car) => {
                const { status, msg } = car;
                if (status === "SUCCESS") {
                  const options = msg.map((item) => ({
                    id: item.id,
                    label: item.plate_no,
                  }));
                  setSubOptions((prevOptions) => ({
                    ...prevOptions,
                    [data_value]: options,
                  }));
                } else {
                  console.error(car);
                }
              });
              break;
            default:
              break;
          }
        });
      } else {
        console.error(data);
      }
    });
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const jsonData = {
      car_id: data.get("customer_carno"),
      customer_id: data.get("customer_name"),
    };

    GetAdminSearchResult(jsonData).then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        setSearchResults(msg);
        setIsShowOptions(true);
      } else {
        setSearchResults(null);
      }
    });
  };

  const handleSelectCustomer = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setCustomer((item) => [...item, value]);
    } else {
      setCustomer((item) => item.filter((item) => item !== value));
    }
  };

  const handlePrint = (event) => {
    const printContents = printRef.current.innerHTML;
    const originalContents = document.body.innerHTML;

    // Set the page content to the specific element's content
    document.body.innerHTML = printContents;
    window.print();

    // Restore original content after printing
    document.body.innerHTML = originalContents;
  };

  return (
    <div>
      <div className="ml-80 mt-16">
        <div className="text-lg bg-yellow-100 mb-5">{labelValue}</div>
        {isShowOptions && (
          <div>
            {/* temp */}
            <p ref={printRef}>sss6666 777</p>
            <button className="btn" onClick={handlePrint}>
              Print
            </button>
          </div>
        )}
        <form onSubmit={handleSearch}>
          {filterList &&
            filterList.map((filter, index) => (
              <div key={index}>
                <label>{filter.label}</label>
                {subOptions[filter.data_value] && (
                  <select name={filter.data_value}>
                    <option>Nothing Selected</option>
                    {subOptions[filter.data_value].map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}
          <button className="btn" type="submit">
            SEARCH
          </button>
        </form>

        <table className="table table-lg">
          <thead>
            <tr>
              <th></th>
              <th>name</th>
              <th>plate_no</th>
            </tr>
          </thead>
          <tbody>
            {searchResults
              ? searchResults.map((item) => (
                  <tr key={item.customer_id}>
                    <td>
                      <label>
                        <input
                          type="checkbox"
                          className="checkbox"
                          value={item.customer_id}
                          onChange={handleSelectCustomer}
                        />
                      </label>
                    </td>
                    <td>{item.customer_name}</td>
                    <td>{item.plate_no}</td>
                  </tr>
                ))
              : "NO DATA"}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminSearch;
