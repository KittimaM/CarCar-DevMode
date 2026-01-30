import { useEffect, useState } from "react";
import { GetAdminCustomerCar, DeleteAdminCustomerCar } from "../Api";
import Notification from "../Notification/Notification";
import AdminAddCustomerCar from "./AdminAddCustomerCar";
import AdminEditCustomerCar from "./AdminEditCustomerCar";

const AdminCustomerCar = ({ data }) => {
  const { labelValue, permission, code } = data;
  const actions = permission.find(
    (p) => p.code === code,
  ).permission_actions;
  const [viewMode, setViewMode] = useState("list");
  const [customerCarList, setCustomerCarList] = useState();
  const [editItem, setEditItem] = useState(null);
  const [notificationKey, setNotificationKey] = useState(0);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    status: "",
  });

  const fetchCustomerCar = () => {
    GetAdminCustomerCar().then(({ status, msg }) => {
      if (status === "SUCCESS") {
        setCustomerCarList(msg);
      } else if (status === "NO DATA") {
        setCustomerCarList(null);
      }
    });
  };

  useEffect(() => {
    fetchCustomerCar();
  }, []);

  const handleEditCustomerCar = (
    car_id,
    customer_id,
    plate_no,
    province,
    brand,
    model,
    color,
    size_id,
  ) => {
    setEditItem({
      car_id,
      customer_id,
      plate_no,
      province,
      brand,
      model,
      color,
      size_id,
    });
    setViewMode("edit");
  };

  const handleDeleteCustomerCar = (id, plate_no) => {
    DeleteAdminCustomerCar({ id: id }).then(({ status, msg }) => {
      if (status === "SUCCESS") {
        setNotification({
          show: true,
          message: plate_no + " " + msg,
          status: status,
        });
        fetchCustomerCar();
      } else if (status === "WARNING") {
        setNotification({
          show: true,
          message: plate_no + " " + msg,
          status: status,
        });
      } else if (status === "ERROR") {
        setNotification({
          show: true,
          message: msg,
          status: status,
        });
      }
      setNotificationKey((prev) => prev + 1);
    });
  };

  return (
    <div className="flex flex-col bg-white mx-auto p-5 rounded-lg shadow-xl h-full overflow-y-auto">
      {notification.show && (
        <Notification
          key={notificationKey}
          message={notification.message}
          status={notification.status}
        />
      )}

      <div className="text-4xl font-bold py-8 pl-6 border-b-2 border-gray-200">
        <div className="breadcrumbs">
          <ul>
            <li>{labelValue}</li>
            {viewMode === "list" && <li className="text-xl">CAR LIST</li>}
            {viewMode === "add" && <li className="text-xl">CREATE NEW CAR</li>}
            {viewMode === "edit" && <li className="text-xl">EDIT CAR</li>}
          </ul>
        </div>
      </div>

      <div className="flex gap-4 my-6">
        <button
          className={`btn btn-wide font-bold ${
            viewMode === "list" ? "btn-primary" : "btn-outline"
          }`}
          onClick={() => {
            setViewMode("list");
            fetchCustomerCar();
          }}
        >
          Car List
        </button>

        {actions.includes("add") && (
          <button
            className={`btn btn-wide font-bold ${
              viewMode === "add" ? "btn-primary" : "btn-outline"
            }`}
            onClick={() => setViewMode("add")}
          >
            + Create New Car
          </button>
        )}
      </div>

      {viewMode === "add" && <AdminAddCustomerCar />}
      {viewMode === "edit" && editItem && (
        <AdminEditCustomerCar editItem={editItem} />
      )}

      {viewMode === "list" && (
        <table className="table table-lg">
          <thead>
            <tr>
              <td>Phone</td>
              <td>Name</td>
              <td>Plate No</td>
              <td>Province</td>
              <td>Brand</td>
              <td>Model</td>
              <td>Color</td>
              <td>size</td>
              {(actions.includes("edit") || actions.includes("delete")) && (
                <th className="text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {customerCarList &&
              customerCarList.map((c) => (
                <tr key={c.car_id}>
                  <td>{c.phone}</td>
                  <td>{c.name}</td>
                  <td>{c.plate_no}</td>
                  <td>{c.province}</td>
                  <td>{c.brand}</td>
                  <td>{c.model}</td>
                  <td>{c.color}</td>
                  <td>{c.size}</td>
                  {(actions.includes("edit") || actions.includes("delete")) && (
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        {actions.includes("edit") && (
                          <button
                            className="btn btn-warning"
                            onClick={() =>
                              handleEditCustomerCar(
                                c.car_id,
                                c.customer_id,
                                c.plate_no,
                                c.province,
                                c.brand,
                                c.model,
                                c.color,
                                c.size_id,
                              )
                            }
                          >
                            Edit
                          </button>
                        )}

                        {actions.includes("delete") && (
                          <button
                            className="btn btn-error text-white"
                            onClick={() =>
                              handleDeleteCustomerCar(c.car_id, c.plate_no)
                            }
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminCustomerCar;
