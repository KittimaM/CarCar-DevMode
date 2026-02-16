import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import StoreLogin from "./Layouts/StoreLogin";
import StoreIndex from "./Layouts/StoreIndex";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/store/main" element={<StoreIndex />} />
        <Route path="/" element={<StoreLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
