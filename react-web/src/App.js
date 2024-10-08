import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CustomerFirstPage from "./Layouts/Customer/CustomerFirstPage";
import AdminLogin from "./Layouts/Admin/AdminLogin";
import Index from "./Layouts/Index";
import CustomerBooking from "./Layouts/Customer/CustomerBooking";
import CustomerIndex from "./Layouts/Customer/CustomerIndex";
import CustomerCar from "./Layouts/Customer/CustomerCar";
import CustomerProfile from "./Layouts/Customer/CustomerProfile";
import AdminIndex from "./Layouts/Admin/AdminIndex";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        {/* customer */}
        <Route path="/customer/profile" element={<CustomerProfile />} />
        <Route path="/customer/main" element={<CustomerIndex />} />
        <Route path="/customer/booking" element={<CustomerBooking />} />
        <Route path="/customer/car" element={<CustomerCar />} />
        <Route path="/customer" element={<CustomerFirstPage />} />

        {/* admin */}
        <Route path="/admin/main" element={<AdminIndex />} />
        <Route path="/admin" element={<AdminLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
