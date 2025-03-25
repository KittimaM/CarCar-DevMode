import React, { useEffect, useState } from "react";
import { GetAllBooking } from "../Api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

const AdminSchedule = ({ data }) => {
  const { labelValue, permission } = data;
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortOrder, setSortOrder] = useState({ key: null, direction: "asc" });
  const [filter, setFilter] = useState("");

  const columns = [
    { field: "car_no", headerName: "Car No" },
    { field: "car_color", headerName: "Car's Color" },
    { field: "start_service_datetime", headerName: "Start Time" },
  ];

  useEffect(() => {
    GetAllBooking().then((data) => {
      const { status, msg } = data;
      if (status === "SUCCESS") {
        setTodaySchedule(msg);
      } else {
        console.log(data);
      }
    });
  }, []);

  const handleRowSelection = (id) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((rowId) => rowId !== id)
        : [...prevSelected, id]
    );
  };

  const exportToExcel = () => {
    const selectedData = todaySchedule.filter((row) =>
      selectedRows.includes(row.id)
    );

    if (selectedData.length === 0) {
      alert("No rows selected!");
      return;
    }

    const formattedData = selectedData.map((row, index) => {
      let newRow = { No: index + 1 };
      columns.forEach((col) => {
        newRow[col.headerName] = row[col.field];
      });
      return newRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Schedule");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(dataBlob, "Schedule.xlsx");
  };

  const handleSort = (column) => {
    // Determine the new sorting order
    const newOrder =
      sortOrder.key === column && sortOrder.direction === "asc" ? "desc" : "asc";
  
    // Update state with the new sorting order
    setSortOrder({ key: column, direction: newOrder });
  
    // Sort the data
    setTodaySchedule(sortData(todaySchedule, column, newOrder));
  };

  const sortData = (array, column, order) => {
    const sortedData = [...array].sort((a, b) => {
      if (a[column] < b[column]) {
        return order === "asc" ? -1 : 1;
      }
      if (a[column] > b[column]) {
        return order === "asc" ? 1 : -1;
      }
      return 0;
    });
    return sortedData;
  };

  const filteredData = todaySchedule.filter((row) =>
    columns.some((col) =>
      row[col.field]?.toString().toLowerCase().includes(filter.toLowerCase())
    )
  );

  const getSortIcon = (key) => {
      if (sortOrder.key === key) {
        return sortOrder.direction === "asc" ? (
          <FaSortUp className="mt-1" />
        ) : (
          <FaSortDown className="mt-1" />
        );
      }
      return <FaSort className="mt-1" />;
    };

  return (
    <>
      <div>
        <div className="flex flex-col bg-[#ffffff] mx-auto p-5 rounded-lg shadow-lg h-full overflow-y-auto">
          <div>
            <h1 className="flex justify-start items-center text-4xl font-bold py-10 pl-10 border-b-2 border-[#e5e5e5]">
              {labelValue}
            </h1>
          </div>

          <div className="flex justify-between items-center py-6 ">
            <div className="flex justify-start items-center space-x-2 ">
              <div className="">
                <label className="w-full justify-center items-center p-3">
                  <span className="label-text text-xl">Search:</span>
                </label>
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="p-2 border rounded"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>

            <button
              className="btn tooltip bg-[#4692DD] rounded-md text-white hover:text-black"
              data-tip="Export"
              onClick={exportToExcel}
            >
              <i class="ri-export-line text-2xl font-thin "></i>
            </button>
          </div>
          
          {/* table */}
          <div className="overflow-x-auto">
            <table className="table text-[#1c1c1c] text-lg">
              <thead className="text-xl text-[#313E61] shadow-md bg-[#f1f1f1] overflow-x-auto">
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        setSelectedRows(
                          e.target.checked
                            ? filteredData.map((row) => row.id)
                            : []
                        )
                      }
                      checked={
                        selectedRows.length === filteredData.length &&
                        filteredData.length > 0
                      }
                    />
                  </th>

                  {columns.map((col) => (
                    <th key={col.field} onClick={() => handleSort(col.field)} className="cursor-pointer">
                      <span class="flex gap-2">{col.headerName}{getSortIcon(col.field)}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <input
                        type="checkbox"
                        onChange={() => handleRowSelection(row.id)}
                        checked={selectedRows.includes(row.id)}
                      />
                    </td>

                    {columns.map((col) => (
                      <td key={col.field}>{row[col.field]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSchedule;
