import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CustomerIndex from "./Layouts/CustomerIndex";
import CustomerLogin from "./Layouts/CustomerLogin";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/customer/main" element={<CustomerIndex />} />
        <Route path="/" element={<CustomerLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
