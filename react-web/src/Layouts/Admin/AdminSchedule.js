import React, { useEffect, useState } from "react";
import { GetAllBooking } from "../Api";
import { DataGrid  } from "@mui/x-data-grid";
import { TextField } from "@mui/material";

const AdminSchedule = ({ data }) => {
  const { labelValue, permission } = data;
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    GetAllBooking().then((data) => {
      const { status, msg } = data;
      if (status == "SUCCESS") {
        setTodaySchedule(msg);
      } else {
        console.log(data);
      }
    });
  }, []);

  const columns = [
    { field: "no", headerName: "No."},
    { field: "car_no", headerName: "Car No" },
    { field: "start_service_datetime", headerName: "Date"},
    { field: "processing_status", headerName: "Status"}
  ];

  const rows = todaySchedule.map((row, index) => ({
    ...row,
    no: index + 1,
  }));

  const handleRowSelection = (newSelectionModel) => {
    setSelectionModel(newSelectionModel);
  };

  const filteredRows = rows.filter((row) =>
    Object.values(row).some((value) =>
      value ? value.toString().toLowerCase().includes(searchText.toLowerCase()) : false
    )
  );  

  return (
    <>
      <div>
        <div className="container mx-auto bg-white p-3 mt-36 ">
          <div>
            <h1 className="flex justify-start items-center text-4xl font-bold py-10 pl-10 border-b-2 border-[#e5e5e5]">
              {labelValue}
            </h1>
          </div>
          <div style={{ height: 400, width: "100%" }}>
            <TextField
              label="Search"
              variant="outlined"
              fullWidth
              margin="normal"
              onChange={(e) => setSearchText(e.target.value)}
            />
            <DataGrid
              rows={filteredRows}
              columns={columns}
              disableColumnFilter={false}
              disableColumnSorting={false}
              checkboxSelection
              onSelectionModelChange={handleRowSelection}
              selectionModel={selectionModel}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSchedule;
