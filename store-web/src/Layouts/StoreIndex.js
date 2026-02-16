import React from "react";
import { Link } from "react-router-dom";

const StoreIndex = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="navbar bg-base-100 shadow">
        <div className="navbar-start">
          <a className="btn btn-ghost text-xl">Store</a>
        </div>
        <div className="navbar-end">
          <Link to="/" className="btn btn-ghost">
            Logout
          </Link>
        </div>
      </div>
      <main className="p-4">
        <h1 className="text-2xl font-bold">Store Main</h1>
        <p className="mt-2 text-gray-600">Welcome to the store dashboard.</p>
      </main>
    </div>
  );
};

export default StoreIndex;
