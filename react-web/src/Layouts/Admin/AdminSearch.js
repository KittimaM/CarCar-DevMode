import React, { useEffect, useState } from "react";
import {
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
      } else {
        console.log(data);
      }
    });
  };

  return (
    <div>
      <div className="flex flex-col bg-[#ffffff] mx-auto p-5 rounded-lg shadow-lg h-full overflow-y-auto">
        <div className="flex justify-start items-center text-4xl font-bold py-10 pl-10 border-b-2 border-[#e5e5e5]">{labelValue}</div>
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
        {searchResults &&
          searchResults.map((item) => (
            <p>
              {item.name} {item.plate_no}
            </p>
          ))}
      </div>
    </div>
  );
};

export default AdminSearch;
