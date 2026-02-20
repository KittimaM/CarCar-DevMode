import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CustomerIndex from "./Layouts/CustomerIndex";
import CustomerLogin from "./Layouts/CustomerLogin";
import CustomerRegister from "./Layouts/CustomerRegister";
import ProtectedRoute from "./Layouts/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/customer/main"
          element={
            <ProtectedRoute>
              <CustomerIndex />
            </ProtectedRoute>
          }
        />
        <Route path="/customer/register" element={<CustomerRegister />} />
        <Route path="/customer/login" element={<CustomerLogin />} />
        <Route path="/" element={<CustomerLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
