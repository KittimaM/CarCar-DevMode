import { useEffect, useState } from "react";
import { GetAdminCustomerCar, DeleteAdminCustomerCar } from "../../Modules/Api";
import Notification from "../../Notification/Notification";
import CustomerCarEditPage from "./CustomerCarEditPage";
import CustomerCarAddPage from "./CustomerCarAddPage";

const CustomerCarPage = ({ data }) => {
  const { labelValue, permission, code } = data;
  const actions = permission.find((p) => p.code === code).permission_actions;
  const [viewMode, setViewMode] = useState("list");
  const [customerCarList, setCustomerCarList] = useState([]);
  const [editItem, setEditItem] = useState([]);
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
        setCustomerCarList([]);
      }
    });
  };

  useEffect(() => {
    fetchCustomerCar();
  }, []);

  const handleDelete = (id) => {
    DeleteAdminCustomerCar({ id }).then(({ status, msg }) => {
      setNotification({
        show: true,
        message: msg,
        status: status,
      });
      setNotificationKey((prev) => prev + 1);
      if (status === "SUCCESS") {
        fetchCustomerCar();
      }
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

      {viewMode === "add" && <CustomerCarAddPage />}
      {viewMode === "edit" && editItem && (
        <CustomerCarEditPage editItem={editItem} />
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
            {customerCarList.length > 0 ? (
              customerCarList.map((c) => (
                <tr key={c.id}>
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
                        {actions.includes("delete") && (
                          <button
                            className="btn btn-error text-white"
                            onClick={() => handleDelete(c.id)}
                          >
                            Delete
                          </button>
                        )}
                        {actions.includes("edit") && (
                          <button
                            className="btn btn-warning"
                            onClick={() => {
                              setViewMode("edit");
                              setEditItem(c);
                            }}
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={actions.includes("edit") || actions.includes("delete") ? 9 : 8} className="text-center">
                  No Car Available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CustomerCarPage;
