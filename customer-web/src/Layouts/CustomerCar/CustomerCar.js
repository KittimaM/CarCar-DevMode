import React, { useEffect, useState } from "react";
import {
  DeleteCustomerCar,
  GetCustomerCar,
  PostAddCustomerCar,
} from "../../Modules/Api";
import CustomerAddCar from "./CustomerAddCar";

const CustomerCar = () => {
  const [viewMode, setViewMode] = useState("list");
  const [editingCar, setEditingCar] = useState(null);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCars = () => {
    setLoading(true);
    GetCustomerCar().then(({ status, msg }) => {
      setLoading(false);
      if (status === "SUCCESS") setCars(Array.isArray(msg) ? msg : []);
    });
  };

  useEffect(() => {
    fetchCars();
  }, []);

  const handleAddSuccess = () => {
    fetchCars();
    setViewMode("list");
    setEditingCar(null);
  };

  const handleDelete = (carId) => {
    if (!window.confirm("ยืนยันลบรถนี้?")) return;
    DeleteCustomerCar({ id: carId }).then(({ status }) => {
      if (status === "SUCCESS") fetchCars();
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold">รถของฉัน</h2>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setViewMode("add")}
        >
          + เพิ่มรถ
        </button>
      </div>

      {(viewMode === "add" || editingCar) && (
        <CustomerAddCar
          car={editingCar}
          onSuccess={handleAddSuccess}
          onBack={() => { setViewMode("list"); setEditingCar(null); }}
        />
      )}

      {viewMode === "list" && !editingCar && (
        <>
          {loading ? (
            <div className="flex justify-center py-8">
              <span className="loading loading-spinner loading-md" />
            </div>
          ) : cars.length === 0 ? (
            <div className="card bg-base-200/50 rounded-xl p-8 text-center">
              <p className="text-base-content/70 mb-4">ยังไม่มีรถในระบบ</p>
              <button
                className="btn btn-primary"
                onClick={() => setViewMode("add")}
              >
                + เพิ่มรถ
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {cars.map((car) => (
                <div
                  key={car.id}
                  className="card bg-base-100 border border-base-300 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start gap-4"
                >
                  <div>
                    <p className="font-semibold">{car.plate_no}</p>
                    <p className="text-sm text-base-content/70">
                      {car.brand} {car.model || ""} · {car.color}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => setEditingCar(car)}
                    >
                      แก้ไข
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm text-error"
                      onClick={() => handleDelete(car.id)}
                    >
                      ลบ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CustomerCar;
