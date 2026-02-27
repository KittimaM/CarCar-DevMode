import React, { useEffect, useState } from "react";
import {
  GetAllCarSize,
  GetAllProvince,
  PostAddCustomerCar,
  UpdateCustomerCar,
} from "../../Modules/Api";

const CustomerAddCar = ({ car: editCar, onSuccess, onBack }) => {
  const isEdit = Boolean(editCar);
  const [provinces, setProvinces] = useState([]);
  const [carSizes, setCarSizes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [form, setForm] = useState({
    plate_no: "",
    province_id: "",
    brand: "",
    model: "",
    size_id: "",
    color: "",
  });

  useEffect(() => {
    GetAllProvince().then(({ status, msg }) => {
      if (status === "SUCCESS") setProvinces(Array.isArray(msg) ? msg : []);
    });
    GetAllCarSize().then(({ status, msg }) => {
      if (status === "SUCCESS") setCarSizes(Array.isArray(msg) ? msg : []);
    });
  }, []);

  useEffect(() => {
    if (editCar) {
      setForm({
        plate_no: editCar.plate_no || "",
        province_id: String(editCar.province_id || ""),
        brand: editCar.brand || "",
        model: editCar.model || "",
        size_id: String(editCar.size_id || ""),
        color: editCar.color || "",
      });
    }
  }, [editCar]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.plate_no || !form.province_id || !form.brand || !form.size_id || !form.color) {
      setMessage("กรุณากรอกข้อมูลให้ครบ");
      return;
    }
    setLoading(true);
    setMessage(null);
    if (isEdit) {
      UpdateCustomerCar({
        id: editCar.id,
        plate_no: form.plate_no,
        province_id: form.province_id,
        brand: form.brand,
        model: form.model || null,
        size_id: form.size_id,
        color: form.color,
      }).then(({ status, msg }) => {
        setLoading(false);
        if (status === "SUCCESS") {
          setMessage("แก้ไขรถสำเร็จ");
          onSuccess?.();
        } else {
          setMessage(msg?.message || msg || (msg?.code === "ER_DUP_ENTRY" ? "ทะเบียนนี้มีในระบบแล้ว" : "ไม่สามารถแก้ไขรถได้"));
        }
      });
    } else {
      PostAddCustomerCar(form).then(({ status, msg }) => {
        setLoading(false);
        if (status === "SUCCESS") {
          setForm({ plate_no: "", province_id: "", brand: "", model: "", size_id: "", color: "" });
          setMessage("เพิ่มรถสำเร็จ");
          onSuccess?.();
        } else {
          setMessage(msg?.message || msg || (msg?.code === "ER_DUP_ENTRY" ? "ทะเบียนนี้มีในระบบแล้ว" : "ไม่สามารถเพิ่มรถได้"));
        }
      });
    }
  };

  return (
    <div className="bg-base-100 rounded-xl border border-base-300 p-4 sm:p-6 max-w-xl">
      <h3 className="text-lg font-semibold mb-4">{isEdit ? "แก้ไขรถ" : "เพิ่มรถใหม่"}</h3>
      {message && (
        <div className={`alert alert-sm mb-4 ${message.includes("สำเร็จ") ? "alert-success" : "alert-error"}`}>
          <span>{message}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="form-control">
          <span className="label-text">ทะเบียนรถ</span>
          <input
            type="text"
            className="input input-bordered"
            value={form.plate_no}
            onChange={(e) => {
              const v = e.target.value.replace(/[^\u0E00-\u0E7F0-9]/g, "");
              setForm((p) => ({ ...p, plate_no: v }));
            }}
            required
            placeholder="เช่น กก1234"
          />
        </label>
        <label className="form-control">
          <span className="label-text">จังหวัด</span>
          <select
            className="select select-bordered"
            value={form.province_id}
            onChange={(e) => setForm((p) => ({ ...p, province_id: e.target.value }))}
            required
          >
            <option value="">-- เลือกจังหวัด --</option>
            {provinces.map((p) => (
              <option key={p.id} value={p.id}>{p.province}</option>
            ))}
          </select>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="form-control">
            <span className="label-text">ยี่ห้อ</span>
            <input
              type="text"
              className="input input-bordered"
              value={form.brand}
              onChange={(e) => setForm((p) => ({ ...p, brand: e.target.value }))}
              required
              placeholder="เช่น Toyota"
            />
          </label>
          <label className="form-control">
            <span className="label-text">รุ่น (ถ้ามี)</span>
            <input
              type="text"
              className="input input-bordered"
              value={form.model}
              onChange={(e) => setForm((p) => ({ ...p, model: e.target.value }))}
              placeholder="เช่น Camry"
            />
          </label>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="form-control">
            <span className="label-text">ขนาดรถ</span>
            <select
              className="select select-bordered"
              value={form.size_id}
              onChange={(e) => setForm((p) => ({ ...p, size_id: e.target.value }))}
              required
            >
              <option value="">-- เลือก --</option>
              {carSizes.map((s) => (
                <option key={s.id} value={s.id}>{s.size}</option>
              ))}
            </select>
          </label>
          <label className="form-control">
            <span className="label-text">สี</span>
            <input
              type="text"
              className="input input-bordered"
              value={form.color}
              onChange={(e) => setForm((p) => ({ ...p, color: e.target.value }))}
              required
              placeholder="เช่น ขาว"
            />
          </label>
        </div>
        <div className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
          {onBack && (
            <button type="button" className="btn btn-ghost" onClick={onBack}>
              ยกเลิก
            </button>
          )}
          <button type="submit" className="btn btn-primary flex-1 sm:flex-none" disabled={loading}>
            {loading ? "กำลังบันทึก..." : "บันทึก"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerAddCar;
