import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetCustomerProfile } from "../Modules/Api";
import CustomerCar from "./CustomerCar/CustomerCar";
import CustomerProfile from "./CustomerProfile";
import CustomerBooking from "./CustomerBooking";

const CustomerIndex = () => {
  const [profile, setProfile] = useState();
  const [active, setActive] = useState("index");
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    GetCustomerProfile().then(({ status, msg }) => {
      if (status === "SUCCESS") setProfile(msg[0]);
    });
  }, [navigate]);

  const handleSelect = (value) => setActive(value);

  const handleSelectAndClose = (value) => {
    handleSelect(value);
    document.activeElement?.blur?.(); // Close mobile dropdown after selection
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* ================= NAVBAR ================= */}
      <header className="navbar bg-neutral text-neutral-content px-3 sm:px-4 min-h-14 sticky top-0 z-50 shadow-md">
        <div className="flex-1 min-w-0">
          <button
            className="btn btn-ghost text-base sm:text-lg font-bold px-2 sm:px-4 -ml-2"
            onClick={() => handleSelect("index")}
          >
            🚗 Carcare
          </button>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-1 sm:gap-2">
          <button
            className={`btn btn-sm sm:btn-md ${
              active === "customer_car" ? "btn-active" : ""
            }`}
            onClick={() => handleSelect("customer_car")}
          >
            <span className="hidden lg:inline">Customer's car</span>
            <span className="lg:hidden">My Cars</span>
          </button>
          <button
            className={`btn btn-sm sm:btn-md ${
              active === "profile" ? "btn-active" : ""
            }`}
            onClick={() => handleSelect("profile")}
          >
            Profile
          </button>
          <button
            className={`btn btn-sm sm:btn-md ${
              active === "booking" ? "btn-active" : ""
            }`}
            onClick={() => handleSelect("booking")}
          >
            Booking
          </button>
          <button
            className="btn btn-ghost btn-sm sm:btn-md"
            onClick={() => {
              sessionStorage.clear();
              navigate("/");
            }}
          >
            Logout
          </button>
        </nav>

        {/* Mobile Hamburger */}
        <div className="md:hidden dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-square btn-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu dropdown-content menu-sm mt-3 p-2 shadow-lg bg-base-100 rounded-box w-56 text-base right-0 border border-base-200"
          >
            <li>
              <button
                className="py-3"
                onClick={() => handleSelectAndClose("customer_car")}
              >
                My Cars
              </button>
            </li>
            <li>
              <button
                className="py-3"
                onClick={() => handleSelectAndClose("profile")}
              >
                Profile
              </button>
            </li>
            <li>
              <button
                className="py-3"
                onClick={() => handleSelectAndClose("booking")}
              >
                Booking
              </button>
            </li>
            <li>
              <button
                className="py-3 text-error"
                onClick={() => {
                  sessionStorage.clear();
                  navigate("/");
                }}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </header>

      {/* ================= CONTENT ================= */}
      <main className="flex-1 overflow-auto">
        {active === "customer_car" && (
          <div className="p-3 sm:p-4 md:p-6 max-w-6xl mx-auto">
            <CustomerCar />
          </div>
        )}
        {active === "profile" && (
          <div className="p-3 sm:p-4 md:p-6 max-w-2xl mx-auto">
            <CustomerProfile />
          </div>
        )}
        {active === "booking" && (
          <div className="p-3 sm:p-4 md:p-6 max-w-6xl mx-auto">
            <CustomerBooking />
          </div>
        )}

        {/* ================= HERO ================= */}
        {active === "index" && (
          <section
            className="relative w-full min-h-[calc(100vh-3.5rem)] flex items-center justify-center text-center bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url('https://images.pexels.com/photos/1056516/pexels-photo-1056516.jpeg')",
            }}
          >
            <div className="absolute inset-0 bg-black/50" />
            <div className="relative z-10 px-4 sm:px-6 py-8 max-w-md w-full text-white">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide">
                OPEN EVERYDAY
              </h1>
              <p className="text-lg sm:text-2xl md:text-3xl font-semibold mt-2">
                10.00 – 20.00
              </p>
              <p className="text-sm sm:text-base text-gray-200 mt-4 max-w-xs mx-auto">
                Provident cupiditate voluptatem et in. Quaerat fugiat ut
                assumenda.
              </p>
              <button
                className="btn btn-primary mt-6 w-full sm:w-auto px-8 min-h-12 text-base"
                onClick={() => handleSelect("booking")}
              >
                Book Now
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default CustomerIndex;
