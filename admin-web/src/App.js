import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminLogin from "./Layouts/AdminLogin";
import AdminIndex from "./Layouts/AdminIndex";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/main" element={<AdminIndex />} />
        <Route path="/" element={<AdminLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
